import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PermissionModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    type: 'sakit', 
    title: '',
    reason: '',
    start_date: '',
    end_date: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      
      const response = await api.post('/permissions', formData);

      if (response.data.success) {
        alert("Berhasil: " + response.data.message);
        onClose();
        onRefresh();
        
        setFormData({ type: 'sakit', title: '', reason: '', start_date: '', end_date: '' });
      }
    } catch (error) {
      
      const errorMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Terjadi kesalahan";
      alert("Gagal: " + errorMsg);
    }
  };

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
          
          <button type="submit" className="btn-scan" style={{ background: '#4318FF', width: '100%', maxWidth: 'none' }}>
            Kirim Pengajuan
          </button>
        </form>
      </div>
    </div>
  );
};

const Perizinan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/permissions');
      if (response.data.success) {
        setPermissions(response.data.data);
      }
    } catch (error) {
      console.error("Gagal load data", error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7fe' }}>
              <th style={{ padding: '12px' }}>Judul</th>
              <th style={{ padding: '12px' }}>Jenis</th>
              <th style={{ padding: '12px' }}>Durasi</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {permissions.length > 0 ? (
              permissions.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                  <td style={{ padding: '12px' }}>{item.title}</td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>{item.type}</td>
                  <td style={{ padding: '12px' }}>{item.duration_days} Hari</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`status-badge ${item.status}`} style={{ textTransform: 'uppercase' }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Belum ada data pengajuan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <PermissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchPermissions} />
    </div>
  );
};

export default Perizinan;