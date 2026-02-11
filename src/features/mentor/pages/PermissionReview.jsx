import React, { useState, useEffect } from 'react';
import { getPermissions, reviewPermission } from '../../../services/api';
import Modal from '../../shared/components/Modal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import RejectionModal from '../components/RejectionModal';

const MentorPermissionReview = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending'); // Changed from 'sent' to 'pending'
    const [filterType, setFilterType] = useState('');
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [reviewAction, setReviewAction] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    useEffect(() => {
        fetchPermissions();
    }, [filterStatus, filterType]);

    const fetchPermissions = async () => {
        try {
            setLoading(true);
            const params = { limit: 100 };
            if (filterStatus) params.status = filterStatus;
            if (filterType) params.type = filterType;

            const response = await getPermissions(params);
            if (response.data.success) {
                setPermissions(response.data.data || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching permissions:', error);
            setLoading(false);
        }
    };

    const handleViewDetail = (permission) => {
        setSelectedPermission(permission);
        setShowDetailModal(true);
    };

    const handleReviewClick = (action) => {
        setReviewAction(action);
        setShowDetailModal(false);
        
        if (action === 'reject') {
            // Show rejection modal for reject action
            setShowRejectionModal(true);
        } else {
            // Show confirm modal for approve action
            setShowConfirmModal(true);
        }
    };

    const confirmReview = async (rejectionReason = null) => {
        try {
            setSubmitting(true);
            setShowConfirmModal(false);
            setShowRejectionModal(false);

            const response = await reviewPermission(
                selectedPermission.id_permissions, 
                reviewAction,
                rejectionReason
            );

            if (response.data.success) {
                setModal({
                    isOpen: true,
                    type: 'success',
                    title: reviewAction === 'approve' ? 'Perizinan Disetujui!' : 'Perizinan Ditolak',
                    message: response.data.message
                });

                await fetchPermissions();
                setSelectedPermission(null);
            }
        } catch (error) {
            console.error('Error reviewing permission:', error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Review Gagal',
                message: error.response?.data?.message || 'Terjadi kesalahan saat mereview perizinan'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    const formatDateRange = (startDate, endDate, duration) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startDay = start.getDate();
        const endDay = end.getDate();
        const month = start.toLocaleDateString('id-ID', { month: 'long' });

        return `${startDay}-${endDay} ${month} (${duration} Hari)`;
    };

    const getTypeLabel = (type) => {
        const types = {
            sakit: 'Sakit',
            izin: 'Izin',
            cuti: 'Cuti'
        };
        return types[type] || type;
    };

    const getTypeColor = (type) => {
        const colors = {
            sakit: { bg: '#FEF2F2', color: '#EF4444' },
            izin: { bg: '#FEF3C7', color: '#B45309' },
            cuti: { bg: '#DBEAFE', color: '#1E40AF' }
        };
        return colors[type] || { bg: '#F3F4F6', color: '#6B7280' };
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: '#FEF3C7', color: '#B45309', label: 'Menunggu Review' },
            approved: { bg: '#ECFDF5', color: '#10B981', label: 'Disetujui' },
            rejected: { bg: '#FEF2F2', color: '#EF4444', label: 'Ditolak' }
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span style={{
                background: config.bg,
                color: config.color,
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.5px'
            }}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="section-view active">
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h2 className="page-title mentor-perm-title" style={{ 
                    fontSize: '28px', 
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #FF6B00 0%, #FF8534 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px'
                }}>
                    Review Perizinan
                </h2>
                <p className="page-subtitle" style={{ 
                    fontSize: '14px',
                    color: '#6B7280',
                    fontWeight: '500'
                }}>
                    Review dan approve perizinan yang diajukan oleh intern
                </p>
            </div>

            {/* Filters */}
            <div style={{ 
                background: 'white', 
                borderRadius: '16px', 
                padding: '20px',
                marginBottom: '25px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}>
                {/* Status Filter */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                        fontSize: '13px', 
                        fontWeight: '700', 
                        color: '#374151',
                        display: 'block',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Status
                    </label>
                    <div className="mentor-perm-status-filters" style={{ display: 'flex', gap: '10px' }}>
                        {[
                            { value: 'pending', label: 'Perlu Review', icon: 'ri-time-line', color: '#F59E0B' },
                            { value: 'approved', label: 'Disetujui', icon: 'ri-checkbox-circle-line', color: '#10B981' },
                            { value: 'rejected', label: 'Ditolak', icon: 'ri-close-circle-line', color: '#EF4444' }
                        ].map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => setFilterStatus(tab.value)}
                                className="mentor-perm-status-btn"
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    borderRadius: '12px',
                                    border: filterStatus === tab.value ? `2px solid ${tab.color}` : '2px solid #E5E7EB',
                                    background: filterStatus === tab.value ? `${tab.color}10` : 'white',
                                    color: filterStatus === tab.value ? tab.color : '#6B7280',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    if (filterStatus !== tab.value) {
                                        e.currentTarget.style.borderColor = tab.color;
                                        e.currentTarget.style.background = `${tab.color}05`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (filterStatus !== tab.value) {
                                        e.currentTarget.style.borderColor = '#E5E7EB';
                                        e.currentTarget.style.background = 'white';
                                    }
                                }}
                            >
                                <i className={tab.icon} style={{ fontSize: '18px' }}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Type Filter */}
                <div>
                    <label style={{ 
                        fontSize: '13px', 
                        fontWeight: '700', 
                        color: '#374151',
                        display: 'block',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Tipe Perizinan
                    </label>
                    <div className="mentor-perm-type-filters" style={{ display: 'flex', gap: '10px' }}>
                        {[
                            { value: '', label: 'Semua' },
                            { value: 'sakit', label: 'Sakit' },
                            { value: 'izin', label: 'Izin' },
                            { value: 'cuti', label: 'Cuti' }
                        ].map(type => (
                            <button
                                key={type.value}
                                onClick={() => setFilterType(type.value)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: filterType === type.value 
                                        ? 'linear-gradient(135deg, #FF6B00 0%, #FF8534 100%)' 
                                        : '#F3F4F6',
                                    color: filterType === type.value ? 'white' : '#6B7280',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (filterType !== type.value) {
                                        e.currentTarget.style.background = '#E5E7EB';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (filterType !== type.value) {
                                        e.currentTarget.style.background = '#F3F4F6';
                                    }
                                }}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <i className="ri-loader-4-line rotating" style={{ fontSize: '48px', color: '#FF6B00' }}></i>
                    <p style={{ marginTop: '15px', color: '#6B7280' }}>Memuat data perizinan...</p>
                </div>
            ) : permissions.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <i className="ri-inbox-line" style={{ fontSize: '64px', color: '#D1D5DB', marginBottom: '15px' }}></i>
                    <p style={{ color: '#6B7280', fontSize: '16px' }}>Tidak ada perizinan dengan filter ini</p>
                </div>
            ) : (
                <div className="mentor-perm-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
                    {permissions.map((permission) => {
                        const typeColor = getTypeColor(permission.type);
                        return (
                            <div
                                key={permission.id_permissions}
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    border: '2px solid #F3F4F6',
                                    borderRadius: '16px',
                                    overflow: 'hidden'
                                }}
                                onClick={() => handleViewDetail(permission)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 0, 0.15)';
                                    e.currentTarget.style.borderColor = '#FF6B00';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.04)';
                                    e.currentTarget.style.borderColor = '#F3F4F6';
                                }}
                            >
                                {/* Header with gradient */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)',
                                    padding: '16px',
                                    borderBottom: '1px solid #F3F4F6'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            background: typeColor.bg,
                                            color: typeColor.color,
                                            padding: '6px 14px',
                                            borderRadius: '10px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase'
                                        }}>
                                            {getTypeLabel(permission.type)}
                                        </span>
                                        {getStatusBadge(permission.status)}
                                    </div>
                                </div>

                                {/* Body - Content */}
                                <div style={{ padding: '20px' }}>
                                    {/* Intern Name */}
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '12px',
                                        marginBottom: '16px',
                                        paddingBottom: '16px',
                                        borderBottom: '1px dashed #E5E7EB'
                                    }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8534 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            flexShrink: 0
                                        }}>
                                            {permission.internship?.user?.full_name?.charAt(0) || 'U'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ 
                                                fontSize: '16px', 
                                                fontWeight: '700', 
                                                color: '#1F2937',
                                                marginBottom: '2px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {permission.internship?.user?.full_name || 'N/A'}
                                            </div>
                                            <div style={{ 
                                                fontSize: '12px', 
                                                color: '#9CA3AF',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {permission.internship?.user?.position || 'Intern'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Range */}
                                    <div style={{ marginBottom: '14px' }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            marginBottom: '6px'
                                        }}>
                                            <i className="ri-calendar-line" style={{ fontSize: '16px', color: '#FF6B00' }}></i>
                                            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>
                                                Periode
                                            </span>
                                        </div>
                                        <div style={{ 
                                            fontSize: '14px', 
                                            fontWeight: '600', 
                                            color: '#1F2937',
                                            marginLeft: '24px'
                                        }}>
                                            {formatDateRange(permission.start_date, permission.end_date, permission.duration)}
                                        </div>
                                    </div>

                                    {/* Reason Preview */}
                                    <div>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            marginBottom: '6px'
                                        }}>
                                            <i className="ri-file-text-line" style={{ fontSize: '16px', color: '#FF6B00' }}></i>
                                            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>
                                                Alasan
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#4B5563',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            lineHeight: '1.5',
                                            marginLeft: '24px'
                                        }}>
                                            {permission.reason}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer - Action Button */}
                                <div style={{ 
                                    padding: '16px',
                                    background: '#F9FAFB',
                                    borderTop: '1px solid #F3F4F6'
                                }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetail(permission);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            border: '2px solid #FF6B00',
                                            background: 'white',
                                            color: '#FF6B00',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#FF6B00';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.color = '#FF6B00';
                                        }}
                                    >
                                        <i className="ri-eye-line" style={{ fontSize: '16px' }}></i>
                                        Lihat Detail & Review
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedPermission && (
                <div className="modal-overlay open" onClick={() => setShowDetailModal(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '600px',
                            borderRadius: '20px',
                            overflow: 'auto',
                            maxHeight: '90vh'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937' }}>
                                Detail Perizinan
                            </h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    color: '#9CA3AF',
                                    cursor: 'pointer',
                                    padding: '0',
                                    lineHeight: '1'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: '5px' }}>
                                    Nama Intern
                                </label>
                                <div style={{ fontSize: '15px', color: '#1F2937', fontWeight: '600' }}>
                                    {selectedPermission.internship?.user?.full_name || 'N/A'}
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: '5px' }}>
                                    Tipe Perizinan
                                </label>
                                {(() => {
                                    const typeColor = getTypeColor(selectedPermission.type);
                                    return (
                                        <span style={{
                                            background: typeColor.bg,
                                            color: typeColor.color,
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            letterSpacing: '0.5px',
                                            display: 'inline-block'
                                        }}>
                                            {getTypeLabel(selectedPermission.type)}
                                        </span>
                                    );
                                })()}
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: '5px' }}>
                                    Periode
                                </label>
                                <div style={{ fontSize: '15px', color: '#1F2937' }}>
                                    {formatDate(selectedPermission.start_date)} - {formatDate(selectedPermission.end_date)}
                                </div>
                                <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
                                    Durasi: {selectedPermission.duration} hari
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: '5px' }}>
                                    Alasan
                                </label>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#374151',
                                    lineHeight: '1.6',
                                    background: '#F9FAFB',
                                    padding: '12px',
                                    borderRadius: '8px'
                                }}>
                                    {selectedPermission.reason}
                                </div>
                            </div>

                            {selectedPermission.attachment_url && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: '5px' }}>
                                        Lampiran
                                    </label>
                                    <div style={{
                                        background: '#F9FAFB',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E7EB'
                                    }}>
                                        <img
                                            src={selectedPermission.attachment_url}
                                            alt="Lampiran Perizinan"
                                            style={{
                                                width: '100%',
                                                maxHeight: '300px',
                                                objectFit: 'contain',
                                                borderRadius: '4px',
                                                display: 'block'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const fallback = e.target.parentElement.querySelector('.fallback-message');
                                                if (fallback) fallback.style.display = 'flex';
                                            }}
                                        />
                                        <div
                                            className="fallback-message"
                                            style={{
                                                display: 'none',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '40px 20px',
                                                color: '#9CA3AF',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <i className="ri-image-line" style={{ fontSize: '48px', marginBottom: '8px', color: '#D1D5DB' }}></i>
                                            <p style={{ fontSize: '14px', margin: '0 0 8px 0', color: '#6B7280' }}>Gambar tidak dapat dimuat</p>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log('Opening attachment:', selectedPermission.attachment_url);
                                                    if (selectedPermission.attachment_url) {
                                                        window.open(selectedPermission.attachment_url, '_blank', 'noopener,noreferrer');
                                                    }
                                                }}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#FF6B00',
                                                    fontSize: '13px',
                                                    textDecoration: 'underline',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                            >
                                                Buka di tab baru →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: '5px' }}>
                                    Status
                                </label>
                                {getStatusBadge(selectedPermission.status)}
                            </div>
                        </div>

                        {/* Action Buttons - Only show for 'pending' status */}
                        {selectedPermission.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                                <button
                                    onClick={() => handleReviewClick('reject')}
                                    disabled={submitting}
                                    style={{
                                        flex: 1,
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        border: '2px solid #EF4444',
                                        background: 'white',
                                        color: '#EF4444',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        opacity: submitting ? 0.5 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!submitting) {
                                            e.currentTarget.style.background = '#EF4444';
                                            e.currentTarget.style.color = 'white';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!submitting) {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.color = '#EF4444';
                                        }
                                    }}
                                >
                                    Tolak
                                </button>
                                <button
                                    onClick={() => handleReviewClick('approve')}
                                    disabled={submitting}
                                    style={{
                                        flex: 1,
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: '#10B981',
                                        color: 'white',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        opacity: submitting ? 0.5 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!submitting) e.currentTarget.style.background = '#059669';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!submitting) e.currentTarget.style.background = '#10B981';
                                    }}
                                >
                                    Setujui
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => confirmReview()}
                title="Setujui Perizinan?"
                message="Perizinan akan langsung disetujui dan intern dapat menggunakan izin tersebut."
                confirmText="Ya, Setujui"
                cancelText="Batal"
                image="/images/sukses.png"
                confirmButtonStyle="primary"
            />

            {/* Rejection Modal */}
            <RejectionModal
                isOpen={showRejectionModal}
                onClose={() => setShowRejectionModal(false)}
                onConfirm={(rejectionReason) => confirmReview(rejectionReason)}
                title="Tolak Perizinan"
                permissionData={selectedPermission}
            />

            {/* Result Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                type={modal.type}
                title={modal.title}
                message={modal.message}
            />
        </div>
    );
};

export default MentorPermissionReview;
