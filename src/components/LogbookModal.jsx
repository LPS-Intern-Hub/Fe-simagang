// import React, { useState, useEffect } from 'react';
// import { createLogbook, updateLogbook } from '../services/api';

// const LogbookModal = ({ isOpen, onClose, onRefresh, editData = null }) => {
//     const [formData, setFormData] = useState({
//         date: '',
//         title: '',
//         activity_detail: '',
//         result_output: '',
//         status: 'sent'
//     });
//     const [submitting, setSubmitting] = useState(false);

//     useEffect(() => {
//         if (editData) {
//             setFormData({
//                 date: editData.date ? editData.date.slice(0, 10) : '',
//                 title: editData.title || '',
//                 activity_detail: editData.activity_detail || '',
//                 result_output: editData.result_output || '',
//                 status: editData.status || 'sent'
//             });
//         } else {
//             setFormData({ date: '', title: '', activity_detail: '', result_output: '', status: 'sent' });
//         }
//     }, [editData, isOpen]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitting(true);
//         try {
//             if (editData) {
//                 await updateLogbook(editData.id_logbooks, formData);
//             } else {
//                 await createLogbook(formData);
//             }
//             onRefresh();
//             onClose();
//         } catch (error) {
//             alert("❌ Error: " + (error.response?.data?.message || "Something went wrong"));
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="modal-overlay open">
//             <div className="modal-content">
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                     <h3>{editData ? 'Edit Logbook' : 'New Logbook Entry'}</h3>
//                     <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
//                         <div>
//                             <label className="form-label">Activity Title</label>
//                             <input type="text" className="form-input" required value={formData.title}
//                                 onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
//                         </div>
//                         <div>
//                             <label className="form-label">Date</label>
//                             <input type="date" className="form-input" required value={formData.date}
//                                 onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
//                         </div>
//                     </div>
//                     <div style={{ marginTop: '15px' }}>
//                         <label className="form-label">Activity Detail</label>
//                         <textarea className="form-textarea" rows="4" required value={formData.activity_detail}
//                             onChange={(e) => setFormData({ ...formData, activity_detail: e.target.value })}></textarea>
//                     </div>
//                     <div style={{ marginTop: '15px', marginBottom: '20px' }}>
//                         <label className="form-label">Output / Result</label>
//                         <textarea className="form-textarea" rows="3" required value={formData.result_output}
//                             onChange={(e) => setFormData({ ...formData, result_output: e.target.value })}></textarea>
//                     </div>
//                     <button type="submit" className="btn-scan" style={{ width: '100%', background: '#4318FF' }} disabled={submitting}>
//                         {submitting ? 'Submitting...' : editData ? 'Save Changes' : 'Post Logbook'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default LogbookModal;