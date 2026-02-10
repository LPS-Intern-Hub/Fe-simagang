import React, { useState, useEffect } from "react";
import {
  getLogbooks,
  createLogbook,
  updateLogbook,
  deleteLogbook,
  getPresences
} from "../services/api";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import "remixicon/fonts/remixicon.css";

const Logbook = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logbookToDelete, setLogbookToDelete] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [validationError, setValidationError] = useState('');

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
      console.log('Logbook response:', response);
      console.log('Logbook data:', response.data);
      const logbookData = response.data.data || [];
      console.log('Processed logbook data:', logbookData);
      setLogbooks(logbookData);
      setCurrentWeek(0); // Reset to first week when data changes
      setError(null);
    } catch (err) {
      console.error('Error fetching logbooks:', err);
      console.error('Error response:', err.response);
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
    setValidationError('');
    
    // Validate minimum length
    if (formData.activity_detail.trim().length < 10) {
      setValidationError('Kegiatan harus minimal 10 karakter');
      return;
    }
    
    if (formData.result_output.trim().length < 10) {
      setValidationError('Output kegiatan harus minimal 10 karakter');
      return;
    }
    
    try {
      const payload = {
        date: formData.date,
        activity_detail: formData.activity_detail.trim(),
        result_output: formData.result_output.trim(),
        status: "draft"
      };

      console.log('Submitting logbook:', payload);

      if (editId) {
        const response = await updateLogbook(editId, payload);
        console.log('Update response:', response);
        setShowEditModal(false);
      } else {
        const response = await createLogbook(payload);
        console.log('Create response:', response);
      }

      setFormData({
        date: "",
        activity_detail: "",
        result_output: "",
        status: "draft"
      });
      setEditId(null);
      await fetchLogbooks();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving logbook:', error);
      console.error('Error details:', error.response);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Menyimpan Logbook',
        message: error.response?.data?.message || 'Gagal menyimpan logbook. Silakan coba lagi.'
      });
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

  const handleDelete = (id) => {
    setLogbookToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (logbookToDelete) {
      try {
        await deleteLogbook(logbookToDelete);
        fetchLogbooks();
      } catch (error) {
        console.error('Failed to delete logbook:', error);
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menghapus',
          message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus logbook'
        });
      } finally {
        setLogbookToDelete(null);
      }
    }
  };

  const handleSubmitClick = () => {
    const draftLogbooks = logbooks.filter(l => l.status === 'draft');
    if (draftLogbooks.length === 0) {
      return;
    }
    setShowSubmitModal(true);
  };

  const submitToMentor = async () => {
    setShowSubmitModal(false);
    const draftLogbooks = logbooks.filter(l => l.status === 'draft');
    
    try {
      for (const logbook of draftLogbooks) {
        await updateLogbook(logbook.id_logbooks, { ...logbook, status: 'sent' });
      }
      await fetchLogbooks();
      setShowSubmitSuccessModal(true);
    } catch (error) {
      console.error('Failed to submit logbooks:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Mengajukan Logbook',
        message: error.response?.data?.message || 'Terjadi kesalahan saat mengajukan logbook ke mentor'
      });
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
  const sentLogbooks = logbooks.filter(l => l.status === 'sent' || l.status === 'reviewed' || l.status === 'approved_by_mentor');
  
  // Get the most recent sent/in-progress logbook to display progress
  const inProgressLogbook = sentLogbooks.length > 0 ? sentLogbooks[0] : null;
  
  // Group draft by week (Monday-Friday only)
  const draftsByWeek = draftLogbooks.reduce((acc, logbook) => {
    const logbookDate = new Date(logbook.date);
    const dayOfWeek = logbookDate.getDay();
    
    // Include all days (remove weekend restriction for now)
    // Skip weekends (0 = Sunday, 6 = Saturday)
    // if (dayOfWeek === 0 || dayOfWeek === 6) return acc;
    
    const monday = getMonday(logbookDate);
    const weekKey = monday.toISOString().split('T')[0];
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(logbook);
    return acc;
  }, {});
  
  console.log('Draft logbooks:', draftLogbooks);
  console.log('Drafts by week:', draftsByWeek);
  
  // Sort each week's logbooks by date
  Object.keys(draftsByWeek).forEach(weekKey => {
    draftsByWeek[weekKey].sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  
  // Get sorted week keys (most recent first)
  const weekKeys = Object.keys(draftsByWeek).sort((a, b) => new Date(b) - new Date(a));
  const currentWeekKey = weekKeys[currentWeek];
  const currentWeekLogbooks = currentWeekKey ? draftsByWeek[currentWeekKey] : [];
  
  console.log('Week keys:', weekKeys);
  console.log('Current week:', currentWeek);
  console.log('Current week key:', currentWeekKey);
  console.log('Current week logbooks:', currentWeekLogbooks);
  
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
        {validationError && (
          <div style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
            borderRadius: "8px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <i className="ri-error-warning-line"></i>
            {validationError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label className="form-label" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Tanggal</label>
            <input
              type="date"
              className="form-input"
              required
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setValidationError('');
              }}
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
              onChange={(e) => {
                setFormData({ ...formData, activity_detail: e.target.value });
                setValidationError('');
              }}
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
              onChange={(e) => {
                setFormData({ ...formData, result_output: e.target.value });
                setValidationError('');
              }}
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
      {draftLogbooks.length === 0 ? (
        <div className="card" style={{ marginBottom: '20px', textAlign: 'center', padding: '40px', color: '#999' }}>
          <i className="ri-file-list-line" style={{ fontSize: '48px', marginBottom: '16px', display: 'block', color: '#ddd' }}></i>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>Belum ada draft logbook</p>
          <p style={{ fontSize: '14px' }}>Buat logbook baru dengan mengisi form di atas</p>
        </div>
      ) : currentWeekLogbooks.length > 0 ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontWeight: '700', fontSize: '18px' }}>
              Draft: {currentWeekLogbooks[0] && formatMonth(currentWeekLogbooks[0].date)}
            </h3>
            <button
              onClick={handleSubmitClick}
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
                  <th style={{ textAlign: 'left', padding: '16px 12px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase', width: '100px' }}>TANGGAL</th>
                  <th style={{ textAlign: 'left', padding: '16px 12px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase', width: '60px' }}>NO</th>
                  <th style={{ textAlign: 'left', padding: '16px 12px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>KEGIATAN</th>
                  <th style={{ textAlign: 'left', padding: '16px 12px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>OUTPUT</th>
                  <th style={{ textAlign: 'right', padding: '16px 12px', fontWeight: '600', fontSize: '12px', color: '#666', textTransform: 'uppercase', width: '80px' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {sortedDates.map((dateKey, dateIndex) => {
                  const logbooksOnDate = logbooksByDate[dateKey];
                  return (
                    <tr key={dateKey} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '16px 12px', fontSize: '14px', whiteSpace: 'nowrap', verticalAlign: 'top', color: '#333', fontWeight: '500' }}>
                        {formatDateShort(dateKey)}
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', verticalAlign: 'top', color: '#666' }}>
                        {dateIndex + 1}
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', maxWidth: '400px', wordBreak: 'break-word', verticalAlign: 'top', lineHeight: '1.6' }}>
                        <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                          {logbooksOnDate.map(logbook => (
                            <li key={logbook.id_logbooks} style={{ marginBottom: '6px', color: '#333' }}>
                              {logbook.activity_detail}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', maxWidth: '400px', wordBreak: 'break-word', verticalAlign: 'top', lineHeight: '1.6' }}>
                        <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                          {logbooksOnDate.map(logbook => (
                            <li key={logbook.id_logbooks} style={{ marginBottom: '6px', color: '#333' }}>
                              {logbook.result_output}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'right', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                          {logbooksOnDate.map(logbook => (
                            <div key={logbook.id_logbooks} style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleEdit(logbook)}
                                style={{
                                  background: 'transparent',
                                  color: '#1976D2',
                                  border: 'none',
                                  padding: '4px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '18px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s',
                                  opacity: 1
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                title="Edit"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(logbook.id_logbooks)}
                                style={{
                                  background: 'transparent',
                                  color: '#C62828',
                                  border: 'none',
                                  padding: '4px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '18px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s',
                                  opacity: 1
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
      ) : (
        <div className="card" style={{ marginBottom: '20px', textAlign: 'center', padding: '40px', color: '#999' }}>
          <i className="ri-file-list-line" style={{ fontSize: '48px', marginBottom: '16px', display: 'block', color: '#ddd' }}></i>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>Tidak ada draft untuk minggu yang dipilih</p>
          <p style={{ fontSize: '14px' }}>Navigasi ke minggu lain atau buat logbook baru</p>
        </div>
      )}

      {/* Progress Tracking Card */}
      {inProgressLogbook && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '24px', fontWeight: '600', fontSize: '16px', color: '#333' }}>
            Laporan Logbook: {formatMonth(inProgressLogbook.date)}
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
              {[0, 1, 2].map((lineIndex) => {
                const currentStatus = inProgressLogbook.status;
                let isCompleted = false;
                
                // Line 0 is between step 1 and 2, Line 1 is between step 2 and 3, Line 2 is between step 3 and 4
                if (currentStatus === 'reviewed' && lineIndex === 0) isCompleted = true;
                else if (currentStatus === 'approved_by_mentor' && lineIndex <= 1) isCompleted = true;
                else if (currentStatus === 'approved' && lineIndex <= 2) isCompleted = true;
                
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
                { label: 'Terkirim', status: 'sent', number: 1 },
                { label: 'Review Mentor', status: 'reviewed', number: 2 },
                { label: 'Ka. Divisi', status: 'approved_by_mentor', number: 3 },
                { label: 'Selesai', status: 'approved', number: 4 }
              ].map((step, index) => {
                // Determine step state
                let stepState = 'pending';
                const currentStatus = inProgressLogbook.status;
                
                if (currentStatus === 'sent') {
                  if (index === 0) stepState = 'completed';
                  else if (index === 1) stepState = 'current';
                } else if (currentStatus === 'reviewed') {
                  if (index <= 1) stepState = 'completed';
                  else if (index === 2) stepState = 'current';
                } else if (currentStatus === 'approved_by_mentor') {
                  if (index <= 2) stepState = 'completed';
                  else if (index === 3) stepState = 'current';
                } else if (currentStatus === 'approved') {
                  stepState = 'completed';
                }
                
                return (
                  <div key={step.status} style={{ 
                    width: '25%',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: index === 0 ? 'flex-start' : index === 3 ? 'flex-end' : 'center',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    {/* Circle */}
                    <div style={{
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
                      {stepState === 'completed' && inProgressLogbook.date ? 
                        new Date(inProgressLogbook.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' }) 
                        : stepState === 'current' ? 'Sedang di review' : ''}
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
                {inProgressLogbook.status === 'sent' && 'Menunggu Review Mentor'}
                {inProgressLogbook.status === 'reviewed' && 'Menunggu Review Ka. Divisi'}
                {inProgressLogbook.status === 'approved_by_mentor' && 'Menunggu Persetujuan Final'}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {inProgressLogbook.status === 'sent' && 'Mohon tunggu, logbook sedang diperiksa oleh Mentor.'}
                {inProgressLogbook.status === 'reviewed' && 'Mohon tunggu, logbook sedang diperiksa oleh Ka. Divisi.'}
                {inProgressLogbook.status === 'approved_by_mentor' && 'Mohon tunggu, logbook dalam proses persetujuan akhir.'}
              </div>
            </div>
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
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Berhasil!"
        message="Logbook berhasil disimpan ke draft"
        buttonText="Tutup"
      />

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
                  setValidationError('');
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
            {validationError && (
              <div style={{
                padding: "12px 16px",
                marginBottom: "16px",
                backgroundColor: "#FEE2E2",
                color: "#991B1B",
                borderRadius: "8px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <i className="ri-error-warning-line"></i>
                {validationError}
              </div>
            )}
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
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    setValidationError('');
                  }}
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
                  onChange={(e) => {
                    setFormData({ ...formData, activity_detail: e.target.value });
                    setValidationError('');
                  }}
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
                  onChange={(e) => {
                    setFormData({ ...formData, result_output: e.target.value });
                    setValidationError('');
                  }}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setLogbookToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Anda yakin ingin menghapus data ini?"
        subtitle="Data yang telah dihapus tidak dapat dipulihkan."
        confirmText="Ya, hapus"
        cancelText="Batal"
        image="/images/remove.png"
        confirmButtonStyle="danger"
      />

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={submitToMentor}
        title="Ajukan logbook ke mentor?"
        subtitle={`Anda akan mengajukan ${draftLogbooks.length} logbook draft ke mentor untuk disetujui.`}
        confirmText="Ya, ajukan"
        cancelText="Batal"
        image="/images/absenMasuk.png"
        confirmButtonStyle="primary"
      />

      {/* Submit Success Modal */}
      <Modal
        isOpen={showSubmitSuccessModal}
        onClose={() => setShowSubmitSuccessModal(false)}
        type="success"
        title="Logbook Berhasil Diajukan!"
        message="Logbook Anda telah berhasil diajukan ke mentor untuk ditinjau."
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

export default Logbook;
