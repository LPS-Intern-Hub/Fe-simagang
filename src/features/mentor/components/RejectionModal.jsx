import React, { useState, useEffect } from 'react';

const RejectionModal = ({ isOpen, onClose, onConfirm, title = "Tolak Logbook", itemData, itemType = "logbook", permissionData }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');

    // Use permissionData if available (for backward compatibility)
    const displayData = permissionData || itemData;

    useEffect(() => {
        if (isOpen) {
            setRejectionReason('');
            setError('');
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (!rejectionReason || rejectionReason.trim().length < 10) {
            setError('Alasan penolakan minimal 10 karakter');
            return;
        }
        onConfirm(rejectionReason);
        setRejectionReason('');
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay open" onClick={onClose}>
            <div 
                className="modal-content" 
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '500px',
                    borderRadius: '20px',
                    padding: '0'
                }}
            >
                {/* Header with gradient */}
                <div style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    padding: '24px',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ 
                                fontSize: '20px', 
                                fontWeight: '700', 
                                margin: '0 0 4px 0',
                                color: 'white'
                            }}>
                                {title}
                            </h3>
                            <p style={{ 
                                fontSize: '13px', 
                                margin: 0, 
                                opacity: 0.9 
                            }}>
                                Berikan alasan penolakan perizinan
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '24px' }}>
                    {/* Textarea */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '8px'
                        }}>
                            Alasan Penolakan <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => {
                                setRejectionReason(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Tuliskan alasan penolakan dengan jelas (minimal 10 karakter)"
                            rows={5}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: error ? '2px solid #EF4444' : '2px solid #E5E7EB',
                                fontSize: '14px',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                resize: 'vertical',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => {
                                if (!error) e.target.style.borderColor = '#FF6B00';
                            }}
                            onBlur={(e) => {
                                if (!error) e.target.style.borderColor = '#E5E7EB';
                            }}
                        />
                        {error && (
                            <div style={{
                                color: '#EF4444',
                                fontSize: '12px',
                                marginTop: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <i className="ri-error-warning-line"></i>
                                {error}
                            </div>
                        )}
                        <div style={{
                            fontSize: '12px',
                            color: rejectionReason.length >= 10 ? '#10B981' : '#9CA3AF',
                            marginTop: '6px',
                            textAlign: 'right'
                        }}>
                            {rejectionReason.length} / 10 karakter minimum
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '24px'
                    }}>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: '2px solid #E5E7EB',
                                background: 'white',
                                color: '#6B7280',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F9FAFB';
                                e.currentTarget.style.borderColor = '#D1D5DB';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#E5E7EB';
                            }}
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={rejectionReason.length < 10}
                            style={{
                                flex: 1,
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: rejectionReason.length >= 10 
                                    ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' 
                                    : '#E5E7EB',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: rejectionReason.length >= 10 ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s',
                                opacity: rejectionReason.length >= 10 ? 1 : 0.6
                            }}
                            onMouseEnter={(e) => {
                                if (rejectionReason.length >= 10) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (rejectionReason.length >= 10) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            <i className="ri-close-circle-line" style={{ marginRight: '6px' }}></i>
                            Tolak {itemType === 'logbook' ? 'Logbook' : 'Perizinan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;
