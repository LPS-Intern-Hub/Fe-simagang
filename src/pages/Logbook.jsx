import React, { useState, useEffect } from "react";
import {
  getLogbooks,
  createLogbook,
  updateLogbook,
  deleteLogbook,
  getPresences
} from "../services/api";
import "remixicon/fonts/remixicon.css";

const Logbook = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    activity_detail: "",
    result_output: "",
    status: "draft"
  });

  useEffect(() => {
    fetchLogbooks();
    fetchPresences();
  }, []);

  const fetchLogbooks = async () => {
    try {
      setLoading(true);
      const response = await getLogbooks();
      setLogbooks(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data logbook");
    } finally {
      setLoading(false);
    }
  };

  const fetchPresences = async () => {
    try {
      const response = await getPresences();
      setPresences(response.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil data presensi:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate minimum length
    if (formData.activity_detail.trim().length < 10) {
      return;
    }
    
    if (formData.result_output.trim().length < 10) {
      return;
    }
    
    try {
      const payload = {
        date: formData.date,
        activity_detail: formData.activity_detail.trim(),
        result_output: formData.result_output.trim(),
        status: "draft"
      };

      if (editId) {
        await updateLogbook(editId, payload);
        setShowEditModal(false);
      } else {
        await createLogbook(payload);
      }

      setFormData({
        date: "",
        activity_detail: "",
        result_output: "",
        status: "draft"
      });
      setEditId(null);
      fetchLogbooks();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving logbook:', error);
    }
  };

  const handleEdit = (logbook) => {
    setEditId(logbook.id_logbooks);
    setFormData({
      date: logbook.date?.slice(0, 10),
      activity_detail: logbook.activity_detail,
      result_output: logbook.result_output,
      status: logbook.status
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus logbook ini?")) return;
    try {
      await deleteLogbook(id);
      fetchLogbooks();
    } catch {
      console.error('Failed to delete logbook');
    }
  };

  const submitToMentor = async () => {
    const draftLogbooks = logbooks.filter(l => l.status === 'draft');
    if (draftLogbooks.length === 0) {
      return;
    }
    
    if (!window.confirm(`Ajukan ${draftLogbooks.length} logbook draft ke mentor?`)) return;
    
    try {
      for (const logbook of draftLogbooks) {
        await updateLogbook(logbook.id_logbooks, { ...logbook, status: 'sent' });
      }
      fetchLogbooks();
    } catch {
      console.error('Failed to submit logbooks');
    }
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  // Get Monday of a given date
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // Get Friday of a given week (from Monday)
  const getFriday = (monday) => {
    const friday = new Date(monday);
    friday.setDate(friday.getDate() + 4);
    return friday;
  };

  // Check if date is in the same week
  const isSameWeek = (date1, date2) => {
    const monday1 = getMonday(date1);
    const monday2 = getMonday(date2);
    return monday1.toISOString().split('T')[0] === monday2.toISOString().split('T')[0];
  };

  // Group logbooks by status and month
  const draftLogbooks = logbooks.filter(l => l.status === 'draft');
  const approvedLogbooks = logbooks.filter(l => l.status === 'approved');
  
  // Group draft by week (Monday-Friday only)
  const draftsByWeek = draftLogbooks.reduce((acc, logbook) => {
    const logbookDate = new Date(logbook.date);
    const dayOfWeek = logbookDate.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) return acc;
    
    const monday = getMonday(logbookDate);
    const weekKey = monday.toISOString().split('T')[0];
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(logbook);
    return acc;
  }, {});
  
  // Sort each week's logbooks by date
  Object.keys(draftsByWeek).forEach(weekKey => {
    draftsByWeek[weekKey].sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  
  // Get sorted week keys (most recent first)
  const weekKeys = Object.keys(draftsByWeek).sort((a, b) => new Date(b) - new Date(a));
  const currentWeekKey = weekKeys[currentWeek];
  const currentWeekLogbooks = currentWeekKey ? draftsByWeek[currentWeekKey] : [];
  
  // Group current week logbooks by date
  const logbooksByDate = currentWeekLogbooks.reduce((acc, logbook) => {
    const dateKey = new Date(logbook.date).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(logbook);
    return acc;
  }, {});
  
  // Get sorted dates for current week
  const sortedDates = Object.keys(logbooksByDate).sort((a, b) => new Date(a) - new Date(b));
  
  // Group approved by month
  const groupedByMonth = approvedLogbooks.reduce((acc, logbook) => {
    const monthYear = formatMonth(logbook.date);
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(logbook);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="section-view active">
        <h2 className="page-title">Logbook Harian</h2>
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-view active">
      <h2 className="page-title" style={{ marginBottom: '25px' }}>Logbook Harian</h2>

      {error && (
        <div style={{
          padding: "15px",
          marginBottom: "20px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px"
        }}>
          {error}
        </div>
      )}

      {/* Form Isi Logbook Baru */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "20px", fontWeight: '700', fontSize: '18px' }}>
          Isi Logbook Baru
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label className="form-label" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Tanggal</label>
            <input
              type="date"
              className="form-input"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label className="form-label" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Kegiatan (Min. 10 karakter)</label>
            <textarea
              className="form-textarea"
              rows="4"
              required
              value={formData.activity_detail}
              onChange={(e) => setFormData({ ...formData, activity_detail: e.target.value })}
              style={{ width: '100%', resize: 'vertical' }}
              minLength={10}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label className="form-label" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Output Kegiatan (Min. 10 karakter)</label>
            <textarea
              className="form-textarea"
              rows="4"
              required
              value={formData.result_output}
              onChange={(e) => setFormData({ ...formData, result_output: e.target.value })}
              style={{ width: '100%', resize: 'vertical' }}
              minLength={10}
            />
          </div>

          <button
            type="submit"
            style={{
              background: '#fff',
              color: '#333',
              border: '2px solid #ddd',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <i className="ri-save-line"></i> Simpan ke Draft
          </button>
        </form>
      </div>

      {/* Draft Logbooks Table */}
      {currentWeekLogbooks.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontWeight: '700', fontSize: '18px' }}>
              Draft: {currentWeekLogbooks[0] && formatMonth(currentWeekLogbooks[0].date)}
            </h3>
            <button
              onClick={submitToMentor}
              style={{
                background: '#FF6B00',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '50px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="ri-send-plane-fill"></i> Ajukan ke Mentor
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>TANGGAL</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>NO</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>KEGIATAN</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>OUTPUT</th>
                  <th style={{ textAlign: 'center', padding: '12px 8px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase', width: '100px' }}></th>
                </tr>
              </thead>
              <tbody>
                {sortedDates.map((dateKey, dateIndex) => {
                  const logbooksOnDate = logbooksByDate[dateKey];
                  return (
                    <tr key={dateKey} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 8px', fontSize: '14px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                        {formatDateShort(dateKey)}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '14px', verticalAlign: 'top' }}>
                        {dateIndex + 1}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '14px', maxWidth: '400px', wordBreak: 'break-word', verticalAlign: 'top' }}>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {logbooksOnDate.map(logbook => (
                            <li key={logbook.id_logbooks} style={{ marginBottom: '8px' }}>
                              {logbook.activity_detail}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '14px', maxWidth: '400px', wordBreak: 'break-word', verticalAlign: 'top' }}>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {logbooksOnDate.map(logbook => (
                            <li key={logbook.id_logbooks} style={{ marginBottom: '8px' }}>
                              {logbook.result_output}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexDirection: 'column' }}>
                          {logbooksOnDate.map(logbook => (
                            <div key={logbook.id_logbooks} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleEdit(logbook)}
                                style={{
                                  background: '#E3F2FD',
                                  color: '#1976D2',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '16px'
                                }}
                                title="Edit"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(logbook.id_logbooks)}
                                style={{
                                  background: '#FFEBEE',
                                  color: '#C62828',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '16px'
                                }}
                                title="Hapus"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setCurrentWeek(prev => Math.min(prev + 1, weekKeys.length - 1))}
              disabled={currentWeek >= weekKeys.length - 1}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentWeek >= weekKeys.length - 1 ? '#ccc' : '#666',
                fontSize: '24px',
                cursor: currentWeek >= weekKeys.length - 1 ? 'not-allowed' : 'pointer',
                padding: '4px 8px'
              }}
            >
              ‹
            </button>
            <button style={{
              background: '#FF6B00',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '50%',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'default',
              minWidth: '40px',
              height: '40px'
            }}>
              {currentWeek + 1}
            </button>
            <button 
              onClick={() => setCurrentWeek(prev => Math.max(prev - 1, 0))}
              disabled={currentWeek <= 0}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentWeek <= 0 ? '#ccc' : '#666',
                fontSize: '24px',
                cursor: currentWeek <= 0 ? 'not-allowed' : 'pointer',
                padding: '4px 8px'
              }}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Arsip Logbook Bulanan */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontWeight: '700', fontSize: '18px' }}>Arsip logbook bulanan</h3>
          <select style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            <option>Pilih bulan</option>
            {Object.keys(groupedByMonth).map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {Object.keys(groupedByMonth).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <p>Belum ada logbook yang disetujui</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(groupedByMonth).map(([month, logs]) => (
              <div
                key={month}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  background: '#fafafa'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    <i className="ri-check-line" style={{ fontSize: '14px' }}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Logbook {month}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Disetujui: {new Date(logs[0].approved_at || logs[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  background: '#E8F5E9',
                  color: '#2E7D32',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  DISETUJUI
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #84D187 0%, #4CAF50 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
            }}>
              <i className="ri-check-line" style={{ fontSize: '48px', color: '#fff' }}></i>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>
              Perubahan berhasil disimpan
            </h3>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                marginTop: '24px',
                padding: '10px 32px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                background: '#fff',
                color: '#333',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Edit Logbook</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditId(null);
                  setFormData({
                    date: "",
                    activity_detail: "",
                    result_output: "",
                    status: "draft"
                  });
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '500', fontSize: '14px', marginBottom: '8px', color: '#333' }}>
                  Tanggal
                </label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '500', fontSize: '14px', marginBottom: '8px', color: '#333' }}>
                  Kegiatan
                </label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  value={formData.activity_detail}
                  onChange={(e) => setFormData({ ...formData, activity_detail: e.target.value })}
                  style={{ width: '100%', resize: 'vertical' }}
                  minLength={10}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: '500', fontSize: '14px', marginBottom: '8px', color: '#333' }}>
                  Output Kegiatan
                </label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  value={formData.result_output}
                  onChange={(e) => setFormData({ ...formData, result_output: e.target.value })}
                  style={{ width: '100%', resize: 'vertical' }}
                  minLength={10}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#333',
                  border: '2px solid #ddd',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="ri-save-line"></i> Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logbook;
