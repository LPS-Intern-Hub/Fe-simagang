import React, { useState, useEffect } from 'react';
import { getPermissions, deletePermission } from '../../../services/api'; 
import PermissionModal from '../components/PermissionModal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import Modal from '../../shared/components/Modal';
import RejectionReasonModal from '../components/RejectionReasonModal';

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
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, reason: '' });

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
      'pending': '#FEF3C7 #B45309',
      'approved': '#DCFCE7 #15803D',
      'rejected': '#FEE2E2 #991B1B'
    };
    return colors[status] || '#F3F4F6 #6B7280';
  };

  // Helper function untuk label status
  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Menunggu Persetujuan',
      'approved': 'Disetujui',
      'rejected': 'Ditolak'
    };
    return labels[status] || status;
  };

  // Filter permissions berdasarkan tab
  const getFilteredPermissions = () => {
    if (activeTab === 'semua') return permissions;
    if (activeTab === 'diproses') return permissions.filter(p => p.status === 'pending');
    if (activeTab === 'disetujui') return permissions.filter(p => p.status === 'approved');
    if (activeTab === 'ditolak') return permissions.filter(p => p.status === 'rejected');
    return permissions;
  };

  const filteredPermissions = getFilteredPermissions();

  // Helper function to format month for progress card
  const formatMonthYear = (dateString) => {
    const date = new Date(dateString);
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Get first pending permission for progress tracking
  const pendingPermission = filteredPermissions.find(p => p.status === 'pending');

  return (
    <div className="section-view active">
      {/* Header */}
      <div className="permission-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 className="page-title">Perizinan</h2>
        <button 
          onClick={() => { setSelectedPermission(null); setIsModalOpen(true); }} 
          className="btn-scan permission-add-btn" 
          style={{ background: '#FF6B00', borderRadius: '50px', padding: '12px 24px', width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="ri-add-circle-line"></i> Buat Pengajuan
        </button>
      </div>

      {/* Progress Tracking Card - Show for pending permissions */}
      {pendingPermission && (
        <>
          <p className="page-subtitle" style={{ fontSize: '13px', marginBottom: '16px', color: '#64748B', fontWeight: '600', letterSpacing: '0.5px' }}>
            SEDANG BERLANGSUNG
          </p>
          <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '24px', fontWeight: '600', fontSize: '16px', color: '#333' }}>
            Laporan Perizinan: {formatMonthYear(pendingPermission.start_date)}
          </h3>

          <div style={{ position: 'relative', marginBottom: '40px' }}>
            {/* Background progress line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              right: '20px',
              top: '20px',
              height: '2px',
              display: 'flex',
              zIndex: 1
            }}>
              {[0, 1].map((lineIndex) => {
                // For pending status, only show line between steps
                const isCompleted = false;

                return (
                  <div key={lineIndex} style={{
                    flex: 1,
                    height: '2px',
                    background: isCompleted ? '#4CAF50' : '#E0E0E0'
                  }} />
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {/* Progress steps */}
              {[
                { label: 'Terkirim', status: 'pending', number: 1 },
                { label: 'Review Mentor', status: 'pending', number: 2 },
                { label: 'Selesai', status: 'approved', number: 3 }
              ].map((step, index) => {
                // Determine step state
                let stepState = 'pending';

                if (index === 0) {
                  stepState = 'completed';
                } else if (index === 1) {
                  stepState = 'current';
                }

                return (
                  <div key={step.status + index} style={{
                    width: '33.33%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: index === 0 ? 'flex-start' : index === 2 ? 'flex-end' : 'center',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    {/* Circle */}
                    <div className="permission-step-circle" style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: stepState === 'completed' ? '#4CAF50' : stepState === 'current' ? '#FF6B00' : '#E0E0E0',
                      border: stepState === 'current' ? '3px solid #FFF' : 'none',
                      boxShadow: stepState === 'current' ? '0 0 0 2px #FF6B00' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stepState === 'pending' ? '#999' : '#fff',
                      fontSize: stepState === 'completed' ? '18px' : '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      position: 'relative',
                      zIndex: 2
                    }}>
                      {stepState === 'completed' ? (
                        <i className="ri-check-line"></i>
                      ) : (
                        step.number
                      )}
                    </div>

                    {/* Label */}
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: stepState === 'pending' ? '#999' : '#333',
                      textAlign: 'center',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      {step.label}
                    </div>

                    {/* Date or Status */}
                    <div style={{
                      fontSize: '11px',
                      color: stepState === 'current' ? '#FF6B00' : '#999',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>
                      {stepState === 'completed' && pendingPermission.start_date ?
                        new Date(pendingPermission.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })
                        : stepState === 'current' ? 'Sedang direview' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Info */}
          <div style={{
            padding: '14px 16px',
            background: '#FFF8F0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#FFE8CC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="ri-time-line" style={{ fontSize: '16px', color: '#FF6B00' }}></i>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '2px' }}>
                Menunggu Persetujuan Mentor
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Mohon tunggu, pengajuan izin sedang diproses.
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Section Title and Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <p className="page-subtitle" style={{ fontSize: '13px', marginBottom: '16px', color: '#64748B', fontWeight: '600', letterSpacing: '0.5px' }}>
          RIWAYAT PENGAJUAN
        </p>
        
        {/* Tab Navigation Container */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '8px 16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '0'
          }}>
            {[
              { id: 'semua', label: 'Semua' },
              { id: 'diproses', label: 'Diproses' },
              { id: 'disetujui', label: 'Disetujui' },
              { id: 'ditolak', label: 'Ditolak' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="permission-tab-btn"
                style={{
                  background: activeTab === tab.id 
                    ? 'linear-gradient(90deg, #FFC79F -66.22%, #FF6B00 117.57%)' 
                    : 'transparent',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  borderRadius: '14px',
                  padding: '6px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: activeTab === tab.id ? '#FFFFFF' : '#9CA3AF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
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
              const isProcessing = item.status === 'pending';
              
              return (
                <div
                  key={item.id_permissions}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: isRejected ? '2px solid #FCA5A5' : '1px solid #E5E7EB',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    cursor: isRejected && item.rejection_reason ? 'pointer' : 'default'
                  }}
                  onClick={() => {
                    if (isRejected && item.rejection_reason) {
                      setRejectionModal({ isOpen: true, reason: item.rejection_reason });
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (isRejected && item.rejection_reason) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.15)';
                      e.currentTarget.style.borderColor = '#F87171';
                    } else {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    if (isRejected && item.rejection_reason) {
                      e.currentTarget.style.borderColor = '#FCA5A5';
                    }
                  }}
                >
                  {/* Main Content */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px'
                    }}
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
                    <div className="permission-card-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Action Buttons - Only delete for pending */}
                      {isProcessing && (
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
                          title="Hapus"
                          onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#FEF2F2'}
                        >
                          <i className="ri-delete-bin-line" style={{ fontSize: '16px' }}></i>
                        </button>
                      )}
                      
                      {/* Status Badge */}
                      <div className="permission-status-badge" style={{
                        padding: '8px 20px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        background: isRejected ? '#FEE2E2' : isApproved ? '#DCFCE7' : '#FEF3C7',
                        color: isRejected ? '#991B1B' : isApproved ? '#15803D' : '#B45309',
                        minWidth: '100px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        justifyContent: 'center'
                      }}>
                        {isRejected ? (
                          <>
                            <span>DITOLAK</span>
                            <i className="ri-information-line" style={{ fontSize: '14px' }}></i>
                          </>
                        ) : isApproved ? 'DITERIMA' : 'DIPROSES'}
                      </div>
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

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={rejectionModal.isOpen}
        onClose={() => setRejectionModal({ isOpen: false, reason: '' })}
        rejectionReason={rejectionModal.reason}
        itemType="perizinan"
      />
    </div>
  );
};

export default Perizinan;