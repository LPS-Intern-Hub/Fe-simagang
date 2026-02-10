import React, { useState, useEffect } from 'react';
import { getPermissions, deletePermission } from '../services/api'; 
import PermissionModal from '../components/PermissionModal';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';

const Perizinan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('semua');

  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const handleEdit = (item) => {
    setSelectedPermission(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setPermissionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (permissionToDelete) {
      try {
        await deletePermission(permissionToDelete);
        fetchPermissions();
      } catch (err) {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menghapus',
          message: err.response?.data?.message || 'Terjadi kesalahan saat menghapus data'
        });
      } finally {
        setPermissionToDelete(null);
      }
    }
  };

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await getPermissions();
      if (response.data.success) {
        setPermissions(response.data.data);
      }
      setError(null);
    } catch (error) {
      console.error("Gagal load data", error);
      setError(error.response?.data?.message || 'Gagal memuat data perizinan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Helper function untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Format tanggal untuk card (DD Bulan (X Hari))
  const formatDateCard = (startDate, endDate, duration) => {
    const start = new Date(startDate);
    const dayNum = start.getDate().toString().padStart(2, '0');
    const monthName = start.toLocaleDateString('id-ID', { month: 'long' });
    return `${dayNum} ${monthName} (${duration} Hari)`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'sent': '#FEF3C7 #B45309',
      'review_mentor': '#DBEAFE #1E40AF',
      'review_kadiv': '#E0E7FF #4338CA',
      'approved': '#DCFCE7 #15803D',
      'rejected': '#FEE2E2 #991B1B'
    };
    return colors[status] || '#F3F4F6 #6B7280';
  };

  // Helper function untuk label status
  const getStatusLabel = (status) => {
    const labels = {
      'sent': 'Terkirim',
      'review_mentor': 'Review Mentor',
      'review_kadiv': 'Review Kadiv',
      'approved': 'Disetujui',
      'rejected': 'Ditolak'
    };
    return labels[status] || status;
  };

  // Filter permissions berdasarkan tab
  const getFilteredPermissions = () => {
    if (activeTab === 'semua') return permissions;
    if (activeTab === 'diproses') return permissions.filter(p => ['sent', 'review_mentor', 'review_kadiv'].includes(p.status));
    if (activeTab === 'disetujui') return permissions.filter(p => p.status === 'approved');
    if (activeTab === 'ditolak') return permissions.filter(p => p.status === 'rejected');
    return permissions;
  };

  const filteredPermissions = getFilteredPermissions();

  return (
    <div className="section-view active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 className="page-title">Perizinan</h2>
          <p className="page-subtitle" style={{ fontSize: '13px', marginTop: '4px', color: '#64748B' }}>RIWAYAT PENGAJUAN</p>
        </div>
        <button 
          onClick={() => { setSelectedPermission(null); setIsModalOpen(true); }} 
          className="btn-scan" 
          style={{ background: '#FF6B00', borderRadius: '50px', padding: '12px 24px', width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="ri-add-circle-line"></i> Buat Pengajuan
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '20px',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: '0'
      }}>
        {[
          { id: 'semua', label: 'Semua' },
          { id: 'diproses', label: 'Diproses' },
          { id: 'disetujui', label: 'Disetujui' },
          { id: 'ditolak', label: 'Ditolak' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '500',
              color: activeTab === tab.id ? '#FF6B00' : '#64748B',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '3px solid #FF6B00' : '3px solid transparent',
              transition: 'all 0.2s ease',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="ri-loader-4-line rotating" style={{ fontSize: '32px', color: '#FF6B00' }}></i>
            <p style={{ marginTop: '10px', color: '#6B7280' }}>Loading data...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="ri-error-warning-line" style={{ fontSize: '48px', color: '#EF4444' }}></i>
            <p style={{ marginTop: '10px', color: '#EF4444', fontWeight: 600 }}>{error}</p>
            <button onClick={fetchPermissions} className="btn-scan" style={{ marginTop: '15px', background: '#EF4444', width: 'auto' }}>
              <i className="ri-refresh-line"></i> Retry
            </button>
          </div>
        ) : filteredPermissions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPermissions.map((item) => {
              const isApproved = item.status === 'approved';
              const isRejected = item.status === 'rejected';
              const isProcessing = ['sent', 'review_mentor', 'review_kadiv'].includes(item.status);
              
              return (
                <div
                  key={item.id_permissions}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Icon Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isRejected ? '#FEE2E2' : isApproved ? '#DCFCE7' : '#FEF3C7',
                      flexShrink: 0
                    }}>
                      {isRejected ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 18L18 6M6 6l12 12" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : isApproved ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="2"/>
                          <path d="M12 6v6l4 2" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '15px', 
                        fontWeight: '600', 
                        color: '#1F2937',
                        marginBottom: '4px'
                      }}>
                        {item.title}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <i className="ri-calendar-line" style={{ fontSize: '14px' }}></i>
                        {formatDateCard(item.start_date, item.end_date, item.duration_days)}
                      </div>
                    </div>
                  </div>

                  {/* Status Button & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Action Buttons */}
                    {(isProcessing || isRejected) && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          style={{ 
                            background: '#EFF6FF', 
                            color: '#1E40AF', 
                            border: 'none', 
                            padding: '8px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          title="Edit"
                          onMouseEnter={(e) => e.currentTarget.style.background = '#DBEAFE'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#EFF6FF'}
                        >
                          <i className="ri-edit-line" style={{ fontSize: '16px' }}></i>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id_permissions);
                          }}
                          style={{ 
                            background: '#FEF2F2', 
                            color: '#DC2626', 
                            border: 'none', 
                            padding: '8px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          title="Delete"
                          onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#FEF2F2'}
                        >
                          <i className="ri-delete-bin-line" style={{ fontSize: '16px' }}></i>
                        </button>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div style={{
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      background: isRejected ? '#FEE2E2' : isApproved ? '#DCFCE7' : '#FEF3C7',
                      color: isRejected ? '#991B1B' : isApproved ? '#15803D' : '#B45309',
                      minWidth: '100px',
                      textAlign: 'center'
                    }}>
                      {isRejected ? 'DITOLAK' : isApproved ? 'DITERIMA' : 'DIPROSES'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="ri-file-list-3-line" style={{ fontSize: '48px', color: '#D1D5DB', display: 'block', marginBottom: '10px' }}></i>
            <p style={{ color: '#9CA3AF', fontWeight: 500 }}>
              {activeTab === 'semua' ? 'Belum ada pengajuan perizinan' : `Tidak ada izin yang ${activeTab}`}
            </p>
          </div>
        )}
      </div>

      <PermissionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPermission(null);
        }} 
        onRefresh={fetchPermissions} 
        editData={selectedPermission}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPermissionToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Anda yakin ingin menghapus data ini?"
        subtitle="Data yang telah dihapus tidak dapat dipulihkan."
        confirmText="Ya, hapus"
        cancelText="Batal"
        image="/images/remove.png"
        confirmButtonStyle="danger"
      />

      {/* Error Modal */}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        type="error"
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  );
};

export default Perizinan;