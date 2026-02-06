import React, { useState, useEffect } from 'react';
import { getPermissions, deletePermission } from '../services/api'; 
import PermissionModal from '../components/PermissionModal';

const Perizinan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPermission, setSelectedPermission] = useState(null);

  const handleEdit = (item) => {
    setSelectedPermission(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await deletePermission(id);
        fetchPermissions(); 
      } catch (err) {
        alert("Failed to delete data");
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

return (
    <div className="section-view active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 className="page-title">Perizinan</h2>
          <p className="page-subtitle">Manage your permission requests easily.</p>
        </div>
        <button 
          onClick={() => { setSelectedPermission(null); setIsModalOpen(true); }} 
          className="btn-scan" 
          style={{ background: '#4318FF', borderRadius: '50px', padding: '12px 24px', width: 'auto' }}
        >
          <i className="ri-add-circle-line"></i> Buat Pengajuan
        </button>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <i className="ri-loader-4-line rotating" style={{ fontSize: '32px', color: '#4318FF' }}></i>
            <p style={{ marginTop: '10px', color: '#6B7280' }}>Loading data...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <i className="ri-error-warning-line" style={{ fontSize: '48px', color: '#EF4444' }}></i>
            <p style={{ marginTop: '10px', color: '#EF4444', fontWeight: 600 }}>{error}</p>
            <button onClick={fetchPermissions} className="btn-scan" style={{ marginTop: '15px', background: '#EF4444', width: 'auto' }}>
              <i className="ri-refresh-line"></i> Retry
            </button>
          </div>
        ) : (
          <table className="clean-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Jenis Izin</th>
                <th>Tanggal</th>
                <th>Durasi</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {permissions.length > 0 ? (
                permissions.map((item) => {
                  const [bgColor, textColor] = getStatusColor(item.status).split(' ');
                  return (
                    <tr key={item.id_permissions}>
                      <td style={{ fontWeight: 600 }}>{item.title}</td>
                      <td>
                        <span style={{
                          textTransform: 'capitalize',
                          padding: '4px 10px',
                          background: item.type === 'sakit' ? '#FEF2F2' : '#EFF6FF',
                          color: item.type === 'sakit' ? '#DC2626' : '#2563EB',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {item.type === 'sakit' ? 'Sakit' : 'Izin'}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: '#6B7280' }}>
                        {formatDate(item.start_date)} - {formatDate(item.end_date)}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#374151' }}>
                          {item.duration_days} Days
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '6px 14px',
                          background: bgColor,
                          color: textColor,
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.5px'
                        }}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(item)}
                            style={{ background: '#DBEAFE', color: '#1E40AF', border: 'none', padding: '6px', borderRadius: '6px', cursor: (['pending','rejected'].includes(item.status) ? 'pointer' : 'not-allowed'), opacity: (['pending','rejected'].includes(item.status) ? 1 : 0.5) }}
                            title="Edit"
                            disabled={!['pending','rejected'].includes(item.status)}
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id_permissions)}
                            style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px', borderRadius: '6px', cursor: (['pending','rejected'].includes(item.status) ? 'pointer' : 'not-allowed'), opacity: (['pending','rejected'].includes(item.status) ? 1 : 0.5) }}
                            title="Delete"
                            disabled={!['pending','rejected'].includes(item.status)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>
                    <i className="ri-file-list-3-line" style={{ fontSize: '48px', color: '#D1D5DB', display: 'block', marginBottom: '10px' }}></i>
                    <p style={{ color: '#9CA3AF', fontWeight: 500 }}>No permission requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
    </div>
  );
};

export default Perizinan;