import React, { useState, useEffect } from 'react';
import { getLogbooks, reviewLogbook } from '../../../services/api';
import Modal from '../../shared/components/Modal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import RejectionModal from '../components/RejectionModal';

const MentorLogbookReview = () => {
    const [logbooks, setLogbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sent');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedIntern, setSelectedIntern] = useState(null);
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
        fetchLogbooks();
    }, [activeTab]);

    const fetchLogbooks = async () => {
        try {
            setLoading(true);
            const params = { limit: 1000 };
            if (activeTab !== 'semua') {
                params.status = activeTab;
            }

            const response = await getLogbooks(params);
            if (response.data.success) {
                setLogbooks(response.data.data || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching logbooks:', error);
            setLoading(false);
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

    // Group logbooks by intern and month
    const groupedByIntern = logbooks.reduce((acc, logbook) => {
        const internId = logbook.internship?.id_internships;
        if (!internId) return acc;

        if (!acc[internId]) {
            acc[internId] = {
                intern: logbook.internship,
                logbooks: []
            };
        }
        acc[internId].logbooks.push(logbook);
        return acc;
    }, {});

    // For each intern, group their logbooks by month
    const internMonths = Object.entries(groupedByIntern).map(([internId, data]) => {
        const monthGroups = data.logbooks.reduce((acc, logbook) => {
            const monthKey = formatMonth(logbook.date);

            if (!acc[monthKey]) {
                acc[monthKey] = {
                    logbooks: []
                };
            }
            acc[monthKey].logbooks.push(logbook);
            return acc;
        }, {});

        // Sort logbooks within each month by date
        Object.values(monthGroups).forEach(month => {
            month.logbooks.sort((a, b) => new Date(a.date) - new Date(b.date));
        });

        // Sort months (most recent first)
        const sortedMonths = Object.entries(monthGroups)
            .sort(([a], [b]) => {
                const dateA = new Date(monthGroups[a].logbooks[0].date);
                const dateB = new Date(monthGroups[b].logbooks[0].date);
                return dateB - dateA;
            })
            .map(([key, value]) => ({ monthKey: key, ...value }));

        return {
            internId,
            intern: data.intern,
            months: sortedMonths
        };
    });

    const handleViewMonth = (intern, month) => {
        setSelectedIntern(intern);
        setSelectedMonth(month);
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

            // Review all logbooks in the selected month
            for (const logbook of selectedMonth.logbooks) {
                await reviewLogbook(logbook.id_logbooks, reviewAction, rejectionReason);
            }

            setModal({
                isOpen: true,
                type: 'success',
                title: reviewAction === 'approve' ? 'Logbook Disetujui!' : 'Logbook Ditolak',
                message: `Semua logbook bulan ini berhasil di${reviewAction === 'approve' ? 'setujui' : 'tolak'}`
            });

            await fetchLogbooks();
            setSelectedMonth(null);
            setSelectedIntern(null);
        } catch (error) {
            console.error('Error reviewing logbook:', error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Review Gagal',
                message: error.response?.data?.message || 'Terjadi kesalahan saat mereview logbook'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="section-view active">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h2 className="page-title">Review Logbook</h2>
                    <p className="page-subtitle" style={{ fontSize: '13px', marginTop: '4px', color: '#64748B' }}>
                        RIWAYAT LOGBOOK INTERN
                    </p>
                </div>
            </div>

            {/* Tab Navigation Container - Same style as Perizinan */}
            <div style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '8px 16px',
                marginBottom: '25px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    gap: '0'
                }}>
                    {[
                        { id: 'sent', label: 'Perlu Review' },
                        { id: 'approved', label: 'Disetujui' },
                        { id: 'rejected', label: 'Ditolak' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="mentor-tab-btn"
                            style={{
                                background: activeTab === tab.id
                                    ? 'linear-gradient(90deg, #FFC79F -66.22%, #FF6B00 117.57%)'
                                    : 'transparent',
                                border: 'none',
                                outline: 'none',
                                boxShadow: 'none',
                                borderRadius: '14px',
                                padding: '6px 20px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: activeTab === tab.id ? '#FFFFFF' : '#9CA3AF',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                appearance: 'none'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '0' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <i className="ri-loader-4-line rotating" style={{ fontSize: '32px', color: '#FF6B00' }}></i>
                        <p style={{ marginTop: '10px', color: '#6B7280' }}>Loading data...</p>
                    </div>
                ) : internMonths.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <i className="ri-file-list-3-line" style={{ fontSize: '48px', color: '#D1D5DB', display: 'block', marginBottom: '10px' }}></i>
                        <p style={{ color: '#9CA3AF', fontWeight: 500 }}>
                            Tidak ada logbook dengan status ini
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {internMonths.map(({ internId, intern, months }) => (
                            <div key={internId}>
                                {/* Intern Name Header */}
                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: '#1F2937',
                                    marginBottom: '12px',
                                    marginTop: internMonths[0].internId !== internId ? '20px' : '0'
                                }}>
                                    {intern?.user?.full_name || 'N/A'}
                                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#9CA3AF', marginLeft: '8px' }}>
                                        {intern?.user?.position || ''}
                                    </span>
                                </div>

                                {/* Month Cards */}
                                {months.map((month) => {
                                    const isApproved = month.logbooks[0].status === 'approved';
                                    const isRejected = month.logbooks[0].status === 'rejected';
                                    const isPending = month.logbooks[0].status === 'sent';

                                    return (
                                        <div
                                            key={month.monthKey}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '16px 20px',
                                                background: 'white',
                                                borderRadius: '12px',
                                                border: '1px solid #E5E7EB',
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer',
                                                marginBottom: '8px'
                                            }}
                                            onClick={() => handleViewMonth(intern, month)}
                                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                                        >
                                            {/* Icon Status */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: isRejected ? '#FEE2E2' : isApproved ? '#DCFCE7' : '#FEF3C7',
                                                    flexShrink: 0
                                                }}>
                                                    {isRejected ? (
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6 18L18 6M6 6l12 12" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    ) : isApproved ? (
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="2" />
                                                            <path d="M12 6v6l4 2" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{
                                                        fontSize: '15px',
                                                        fontWeight: '600',
                                                        color: '#1F2937',
                                                        marginBottom: '4px'
                                                    }}>
                                                        {month.monthKey}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: '#64748B',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <i className="ri-calendar-line" style={{ fontSize: '14px' }}></i>
                                                        {month.logbooks.length} hari logbook
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div style={{
                                                padding: '8px 20px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                                background: isRejected ? '#FEE2E2' : isApproved ? '#DCFCE7' : '#FEF3C7',
                                                color: isRejected ? '#991B1B' : isApproved ? '#15803D' : '#B45309',
                                                minWidth: '100px',
                                                textAlign: 'center'
                                            }}>
                                                {isRejected ? 'DITOLAK' : isApproved ? 'DITERIMA' : 'DIPROSES'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedMonth && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '24px',
                            borderBottom: '1px solid #E5E7EB',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'sticky',
                            top: 0,
                            background: 'white',
                            zIndex: 1
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1F2937' }}>
                                    Logbook {selectedMonth.monthKey}
                                </h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
                                    {selectedIntern?.user?.full_name} - {selectedIntern?.user?.position}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#9CA3AF',
                                    padding: '4px'
                                }}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        {/* Modal Body - Table */}
                        <div style={{ padding: '24px' }}>
                            <div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                                            <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', width: '50px' }}>NO</th>
                                            <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', width: '90px' }}>TANGGAL</th>
                                            <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>KEGIATAN</th>
                                            <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>OUTPUT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedMonth.logbooks.map((logbook, index) => (
                                            <tr key={logbook.id_logbooks} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                <td style={{ padding: '16px 12px', fontSize: '14px', color: '#6B7280' }}>
                                                    {index + 1}
                                                </td>
                                                <td style={{ padding: '16px 12px', fontSize: '14px', color: '#1F2937', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                                    {formatDateShort(logbook.date)}
                                                </td>
                                                <td style={{ padding: '16px 12px', fontSize: '14px', color: '#1F2937', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                                    {logbook.activity_detail}
                                                </td>
                                                <td style={{ padding: '16px 12px', fontSize: '14px', color: '#6B7280', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                                    {logbook.result_output || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        {activeTab === 'sent' && (
                            <div style={{
                                padding: '20px 24px',
                                borderTop: '1px solid #E5E7EB',
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                                position: 'sticky',
                                bottom: 0,
                                background: 'white'
                            }}>
                                <button
                                    onClick={() => handleReviewClick('reject')}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: '1px solid #EF4444',
                                        background: 'white',
                                        color: '#EF4444',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <i className="ri-close-circle-line"></i>
                                    Tolak
                                </button>
                                <button
                                    onClick={() => handleReviewClick('approve')}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#10B981',
                                        color: 'white',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <i className="ri-check-line"></i>
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
                title="Setujui Logbook?"
                message="Apakah Anda yakin ingin menyetujui semua logbook bulan ini?"
                confirmText="Setujui"
                confirmButtonStyle="primary"
                confirmColor="#10B981"
                image="/images/approve-logbook.svg"
                loading={submitting}
            />

            {/* Rejection Modal */}
            <RejectionModal
                isOpen={showRejectionModal}
                onClose={() => setShowRejectionModal(false)}
                onConfirm={(rejectionReason) => confirmReview(rejectionReason)}
                title="Tolak Logbook"
                itemData={{
                    intern: selectedIntern,
                    monthKey: selectedMonth?.monthKey,
                    logbooks: selectedMonth?.logbooks
                }}
                itemType="logbook"
            />

            {/* Success/Error Modal */}
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

export default MentorLogbookReview;
