import React, { useState, useEffect } from 'react';
import { getPermissions, createPermission } from '../services/api';

const PermissionModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    type: 'sakit', 
    title: '',
    reason: '',
    start_date: '',
    end_date: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await createPermission(formData);

      if (response.data.success) {
        alert("✅ Berhasil: " + response.data.message);
        onClose();
        onRefresh();
        setFormData({ type: 'sakit', title: '', reason: '', start_date: '', end_date: '' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Terjadi kesalahan";
      alert("❌ Gagal: " + errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Form Pengajuan Izin</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label className="form-label">Jenis Izin</label>
            <select 
              className="form-select" 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="sakit">Sakit</option>
              <option value="izin">Izin / Keperluan Lain</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label className="form-label">Judul Izin (Min. 3 Karakter)</label>
            <input 
              type="text" className="form-input" placeholder="Contoh: Izin Sakit Demam" required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label className="form-label">Tanggal Mulai</label>
              <input type="date" className="form-input" required 
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="form-label">Tanggal Selesai</label>
              <input type="date" className="form-input" required 
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Alasan Detail (Min. 10 Karakter)</label>
            <textarea 
              className="form-textarea" rows="4" required
              placeholder="Berikan alasan lengkap..."
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn-scan" 
            style={{ background: '#4318FF', width: '100%', maxWidth: 'none' }}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="ri-loader-4-line rotating"></i>
                Mengirim...
              </>
            ) : (
              <>
                <i className="ri-send-plane-fill"></i>
                Kirim Pengajuan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const Perizinan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Helper function untuk mendapatkan warna status
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
          <h2 className="page-title">Perizinan & Cuti</h2>
          <p className="page-subtitle">Kelola pengajuan izin Anda dengan mudah.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-scan" style={{ background: '#4318FF', borderRadius: '50px', padding: '12px 24px', width: 'auto' }}>
          <i className="ri-add-circle-line"></i> Buat Pengajuan
        </button>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <i className="ri-loader-4-line rotating" style={{ fontSize: '32px', color: '#FF6B00' }}></i>
            <p style={{ marginTop: '10px', color: '#6B7280' }}>Memuat data...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <i className="ri-error-warning-line" style={{ fontSize: '48px', color: '#EF4444' }}></i>
            <p style={{ marginTop: '10px', color: '#EF4444', fontWeight: 600 }}>{error}</p>
            <button 
              onClick={fetchPermissions}
              className="btn-scan"
              style={{ marginTop: '15px', background: '#EF4444', width: 'auto' }}
            >
              <i className="ri-refresh-line"></i>
              Coba Lagi
            </button>
          </div>
        ) : (
          <table className="clean-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Jenis</th>
                <th>Periode</th>
                <th>Durasi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {permissions.length > 0 ? (
                permissions.map((item) => {
                  const [bgColor, textColor] = getStatusColor(item.status).split(' ');
                  return (
                    <tr key={item.id}>
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
                          {item.type}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: '#6B7280' }}>
                        {formatDate(item.start_date)} - {formatDate(item.end_date)}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#374151' }}>
                          {item.duration_days} Hari
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
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>
                    <i className="ri-file-list-3-line" style={{ fontSize: '48px', color: '#D1D5DB', display: 'block', marginBottom: '10px' }}></i>
                    <p style={{ color: '#9CA3AF', fontWeight: 500 }}>Belum ada data pengajuan perizinan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <PermissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchPermissions} />
    </div>
  );
};

export default Perizinan;