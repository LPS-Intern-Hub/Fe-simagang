import React, { useState, useEffect } from 'react';
import { createPermission, updatePermission } from '../services/api';

const PermissionModal = ({ isOpen, onClose, onRefresh, editData = null }) => {
    const [formData, setFormData] = useState({
        type: 'sakit',
        title: '',
        reason: '',
        start_date: '',
        end_date: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                type: editData.type,
                title: editData.title,
                reason: editData.reason,
                start_date: editData.start_date ? editData.start_date.slice(0, 10) : '',
                end_date: editData.end_date ? editData.end_date.slice(0, 10) : ''
            });
        } else {
            setFormData({
                type: 'sakit',
                title: '',
                reason: '',
                start_date: '',
                end_date: ''
            });
        }
    }, [editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let response;
            if (editData) {
                response = await updatePermission(editData.id_permissions, formData);
            } else {
                response = await createPermission(formData);
            }

            if (response.data.success) {
                alert(`✅ Success: ${editData ? 'Permission updated' : 'Permission submitted'}`);
                onClose();
                onRefresh();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "An error occurred";
            alert("❌ Failed: " + errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay open">
            <div className="modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{editData ? 'Edit Permission' : 'Form Pengajuan Perizinan'}</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label className="form-label">Jenis Izin </label>
                        <select
                            className="form-select"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="sakit">sakit</option>
                            <option value="izin">Others / Personal Necessity</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label className="form-label">Judul (Min. 3 Characters)</label>
                        <input
                            type="text" className="form-input" placeholder="e.g., sakit - Fever" required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label className="form-label">Tanggal Mulai</label>
                            <input type="date" className="form-input" required
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="form-label">Tanggal Akhir</label>
                            <input type="date" className="form-input" required
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label className="form-label">Alasan (Min. 10 Characters)</label>
                        <textarea
                            className="form-textarea" rows="4" required
                            placeholder="Provide a complete reason..."
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn-scan"
                        style={{ background: '#4318FF', width: '100%', maxWidth: 'none' }}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : editData ? 'Save Changes' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PermissionModal;