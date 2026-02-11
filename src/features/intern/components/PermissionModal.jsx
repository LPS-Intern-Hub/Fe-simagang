import React, { useState, useEffect } from 'react';
import { createPermission, updatePermission } from '../../../services/api';
import Modal from '../../shared/components/Modal';

const PermissionModal = ({ isOpen, onClose, onRefresh, editData = null }) => {
    const [formData, setFormData] = useState({
        type: 'sakit',
        reason: '',
        start_date: '',
        end_date: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [modal, setModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        if (editData) {
            setFormData({
                type: editData.type,
                reason: editData.reason,
                start_date: editData.start_date ? editData.start_date.slice(0, 10) : '',
                end_date: editData.end_date ? editData.end_date.slice(0, 10) : ''
            });
        } else {
            setFormData({
                type: 'sakit',
                reason: '',
                start_date: '',
                end_date: ''
            });
        }
        setSelectedFile(null);
        setValidationErrors({});
    }, [editData, isOpen]);

    const validateForm = () => {
        const errors = {};
        
        if (!formData.reason || formData.reason.trim().length < 10) {
            errors.reason = 'Alasan minimal 10 karakter';
        }
        
        if (!formData.start_date) {
            errors.start_date = 'Tanggal mulai harus diisi';
        }
        
        if (!formData.end_date) {
            errors.end_date = 'Tanggal selesai harus diisi';
        }
        
        if (formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
            errors.end_date = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai';
        }
        
        return errors;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setModal({
                    isOpen: true,
                    type: 'error',
                    title: 'File Tidak Valid',
                    message: 'Hanya file PDF, PNG, JPG, JPEG yang diperbolehkan'
                });
                return;
            }
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setModal({
                    isOpen: true,
                    type: 'error',
                    title: 'File Terlalu Besar',
                    message: 'Ukuran file maksimal 5MB'
                });
                return;
            }
            
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        
        setSubmitting(true);
        setValidationErrors({});

        try {
            // Create FormData for multipart upload
            const formDataToSend = new FormData();
            formDataToSend.append('type', formData.type);
            formDataToSend.append('reason', formData.reason);
            formDataToSend.append('start_date', formData.start_date);
            formDataToSend.append('end_date', formData.end_date);
            
            if (selectedFile) {
                formDataToSend.append('document', selectedFile);
            }

            let response;
            if (editData) {
                response = await updatePermission(editData.id_permissions, formDataToSend);
            } else {
                response = await createPermission(formDataToSend);
            }

            if (response.data.success) {
                setModal({
                    isOpen: true,
                    type: 'success',
                    title: editData ? 'Izin Berhasil Diperbarui!' : 'Izin Berhasil Diajukan!',
                    message: editData ? 'Perubahan izin berhasil disimpan.' : 'Pengajuan izin Anda telah berhasil dikirim dan menunggu persetujuan.'
                });
            }
        } catch (error) {
            console.error('Permission submission error:', error);
            
            // Handle validation errors from backend
            if (error.response?.status === 400 && error.response?.data?.errors) {
                const backendErrors = {};
                error.response.data.errors.forEach(err => {
                    backendErrors[err.path] = err.msg;
                });
                setValidationErrors(backendErrors);
                setSubmitting(false);
                return;
            }
            
            const errorMsg = error.response?.data?.message || "Terjadi kesalahan";
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Gagal Menyimpan',
                message: errorMsg
            });
            setSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setModal({ ...modal, isOpen: false });
        if (modal.type === 'success') {
            setSubmitting(false);
            onClose();
            onRefresh();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay open">
            <div className="modal-content" style={{ 
                maxWidth: '500px', 
                borderRadius: '16px', 
                overflow: 'hidden',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '24px 24px 0',
                    flexShrink: 0
                }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Form Pengajuan Izin</h3>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            border: 'none', 
                            background: 'none', 
                            fontSize: '24px', 
                            cursor: 'pointer',
                            color: '#9CA3AF',
                            lineHeight: '1'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div style={{ 
                    overflowY: 'auto',
                    padding: '24px',
                    flex: 1
                }}>
                    <form onSubmit={handleSubmit} id="permissionForm">
                        {/* Jenis Izin */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Jenis Izin
                            </label>
                            <select
                                className="form-select"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                style={{ 
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="sakit">Sakit</option>
                                <option value="izin">Izin</option>
                            </select>
                    </div>

                    {/* Tanggal Mulai & Selesai */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Mulai
                            </label>
                            <input
                                type="date"
                                className="form-input"
                                required
                                value={formData.start_date}
                                onChange={(e) => {
                                    setFormData({ ...formData, start_date: e.target.value });
                                    setValidationErrors({ ...validationErrors, start_date: null });
                                }}
                                style={{ 
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: validationErrors.start_date ? '1px solid #EF4444' : '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                            {validationErrors.start_date && (
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#EF4444' }}>
                                    {validationErrors.start_date}
                                </p>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Selesai
                            </label>
                            <input
                                type="date"
                                className="form-input"
                                required
                                min={formData.start_date || new Date().toISOString().split('T')[0]}
                                value={formData.end_date}
                                onChange={(e) => {
                                    setFormData({ ...formData, end_date: e.target.value });
                                    setValidationErrors({ ...validationErrors, end_date: null });
                                }}
                                style={{ 
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: validationErrors.end_date ? '1px solid #EF4444' : '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                            {validationErrors.end_date && (
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#EF4444' }}>
                                    {validationErrors.end_date}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Alasan */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                            Alasan <span style={{ color: '#9CA3AF', fontWeight: '400' }}>(Min. 10 karakter)</span>
                        </label>
                        <textarea
                            className="form-textarea"
                            rows="4"
                            required
                            placeholder="Tuliskan alasan pengajuan izin..."
                            value={formData.reason}
                            onChange={(e) => {
                                setFormData({ ...formData, reason: e.target.value });
                                setValidationErrors({ ...validationErrors, reason: null });
                            }}
                            style={{ 
                                width: '100%',
                                padding: '10px 12px',
                                border: validationErrors.reason ? '1px solid #EF4444' : '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '14px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            {validationErrors.reason ? (
                                <p style={{ margin: 0, fontSize: '12px', color: '#EF4444' }}>
                                    {validationErrors.reason}
                                </p>
                            ) : (
                                <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>
                                    {formData.reason.length}/10 karakter
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Bukti Pendukung */}
                    <div style={{ marginBottom: '0' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                            Bukti Pendukung
                        </label>
                        <div 
                            onClick={() => document.getElementById('fileInput').click()}
                            style={{ 
                                border: '2px dashed #D1D5DB',
                                borderRadius: '8px',
                                padding: '32px 20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: '#F9FAFB',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#FF6B00';
                                e.currentTarget.style.background = '#FFF7ED';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#D1D5DB';
                                e.currentTarget.style.background = '#F9FAFB';
                            }}
                        >
                            <i className="ri-upload-cloud-2-line" style={{ fontSize: '40px', color: '#9CA3AF', marginBottom: '8px' }}></i>
                            <p style={{ margin: '8px 0 4px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                                {selectedFile ? selectedFile.name : 'Klik untuk upload file'}
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>
                                .pdf, .png, .jpg, .jpeg (maks. 5MB)
                            </p>
                        </div>
                        <input
                            id="fileInput"
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    </form>
                </div>

                {/* Fixed Footer with Submit Button */}
                <div style={{ 
                    padding: '16px 24px 24px',
                    borderTop: '1px solid #E5E7EB',
                    flexShrink: 0,
                    background: '#fff'
                }}>
                    <button
                        type="submit"
                        form="permissionForm"
                        style={{
                            width: '100%',
                            background: '#FF6B00',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            opacity: submitting ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        disabled={submitting}
                    >
                        <i className="ri-send-plane-fill"></i>
                        {submitting ? 'Mengirim...' : 'Kirim Pengajuan Izin'}
                    </button>
                </div>
            </div>

            {/* Success/Error Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={handleModalClose}
                type={modal.type}
                title={modal.title}
                message={modal.message}
            />
        </div>
    );
};

export default PermissionModal;