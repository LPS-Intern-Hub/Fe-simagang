import React, { useState, useEffect } from 'react';
import { getDashboard, getLogbooks, getPermissions, getMentorInternships, getAnnouncements } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const MentorDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [stats, setStats] = useState({
        totalInterns: 0,
        pendingLogbooks: 0,
        pendingPermissions: 0,
        reviewedLogbooksThisMonth: 0,
        reviewedPermissionsThisMonth: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Helper function to count unique intern-month combinations
    const countUniqueInternMonths = (logbooks) => {
        const uniqueCombinations = new Set();
        logbooks.forEach(logbook => {
            const internId = logbook.internship?.id_internships;
            const date = new Date(logbook.date);
            const monthYear = `${internId}-${date.getFullYear()}-${date.getMonth()}`;
            uniqueCombinations.add(monthYear);
        });
        return uniqueCombinations.size;
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Get user data and announcements
            const [dashboardResponse, announcementResponse] = await Promise.all([
                getDashboard(),
                getAnnouncements({ role: 'mentor' })
            ]);

            if (dashboardResponse.data.success) {
                setUserData(dashboardResponse.data.data.user);
            }

            if (announcementResponse.data.success) {
                setAnnouncements(announcementResponse.data.data);
            }

            // Get pending logbooks (status: sent - LogbookStatus enum)
            const logbooksResponse = await getLogbooks({ status: 'sent', limit: 1000 });
            console.log('📊 Logbooks Response:', logbooksResponse.data);
            const pendingLogbooksData = logbooksResponse.data.data || [];
            const pendingLogbooks = countUniqueInternMonths(pendingLogbooksData);

            // Get pending permissions (status: pending - PermissionStatus enum)
            const permissionsResponse = await getPermissions({ status: 'pending', limit: 100 });
            console.log('📊 Permissions Response:', permissionsResponse.data);
            const pendingPermissions = permissionsResponse.data.data?.length || 0;

            // Get interns mentored by this mentor from internships table
            const internshipsResponse = await getMentorInternships();
            console.log('📊 Mentor Internships Response:', internshipsResponse.data);
            const totalInterns = internshipsResponse.data.data?.length || 0;

            // Get reviewed logbooks this month (status: review_kadiv, approved, rejected)
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const reviewedLogbooksResponse = await getLogbooks({
                month: currentMonth,
                year: currentYear,
                limit: 1000
            });
            const reviewedLogbooksData = reviewedLogbooksResponse.data.data?.filter(
                log => ['review_kadiv', 'approved', 'rejected'].includes(log.status)
            ) || [];
            const reviewedLogbooks = countUniqueInternMonths(reviewedLogbooksData);

            // Get reviewed permissions this month
            const reviewedPermissionsResponse = await getPermissions({
                month: currentMonth,
                year: currentYear,
                limit: 100
            });
            const reviewedPermissions = reviewedPermissionsResponse.data.data?.filter(
                perm => ['approved', 'rejected'].includes(perm.status)
            ).length || 0;


            console.log('📊 Dashboard Stats:', {
                totalInterns,
                pendingLogbooks,
                pendingPermissions,
                reviewedLogbooks,
                reviewedPermissions
            });

            setStats({
                totalInterns,
                pendingLogbooks,
                pendingPermissions,
                reviewedLogbooksThisMonth: reviewedLogbooks,
                reviewedPermissionsThisMonth: reviewedPermissions
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const formatDate = () => {
        const date = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    if (loading) {
        return (
            <div className="section-view active" style={{ textAlign: 'center', padding: '50px' }}>
                <i className="ri-loader-4-line rotating" style={{ fontSize: '48px', color: '#FF6B00' }}></i>
                <p style={{ marginTop: '15px', color: '#6B7280' }}>Memuat data dashboard...</p>
            </div>
        );
    }

    return (
        <div className="section-view active">
            {/* Greeting Section */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: '800',
                    fontSize: '32px',
                    lineHeight: '100%',
                    color: '#1F2937',
                    marginBottom: '8px'
                }} className="mentor-greeting">
                    Selamat Datang, {userData?.full_name || 'Mentor'}!
                </h2>
                <p style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: '400',
                    fontSize: '16px',
                    color: '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <img src="/images/calender.png" alt="Calendar" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                    {formatDate()}
                </p>
            </div>

            {/* Summary Cards - 3 Column Layout */}
            <div className="mentor-summary-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {/* Pending Logbooks */}
                <div
                    onClick={() => navigate('/mentor/logbook-review')}
                    style={{
                        background: 'linear-gradient(135deg, #FF881F 0%, #FF6B00 100%)',
                        borderRadius: '20px',
                        padding: '30px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 20px rgba(255, 107, 0, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        position: 'absolute',
                        top: '-30px',
                        right: '-30px',
                        width: '120px',
                        height: '120px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%'
                    }}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '15px'
                        }}>
                            <i className="ri-book-2-line" style={{ fontSize: '24px' }}></i>
                        </div>
                        <div className="mentor-card-value" style={{ fontSize: '36px', fontWeight: '800', marginBottom: '5px' }}>
                            {stats.pendingLogbooks}
                        </div>
                        <div className="mentor-card-label" style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>
                            Logbook Perlu Review
                        </div>
                    </div>
                </div>

                {/* Pending Permissions */}
                <div
                    onClick={() => navigate('/mentor/permission-review')}
                    style={{
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        borderRadius: '20px',
                        padding: '30px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        position: 'absolute',
                        top: '-30px',
                        right: '-30px',
                        width: '120px',
                        height: '120px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%'
                    }}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '15px'
                        }}>
                            <i className="ri-file-text-line" style={{ fontSize: '24px' }}></i>
                        </div>
                        <div className="mentor-card-value" style={{ fontSize: '36px', fontWeight: '800', marginBottom: '5px' }}>
                            {stats.pendingPermissions}
                        </div>
                        <div className="mentor-card-label" style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>
                            Perizinan Perlu Review
                        </div>
                    </div>
                </div>

                {/* Total Interns */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '30px',
                    border: '2px solid #F3F4F6',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: '#ECFDF5',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '15px'
                    }}>
                        <i className="ri-group-line" style={{ fontSize: '24px', color: '#10B981' }}></i>
                    </div>
                    <div className="mentor-card-value" style={{ fontSize: '36px', fontWeight: '800', color: '#1F2937', marginBottom: '5px' }}>
                        {stats.totalInterns}
                    </div>
                    <div className="mentor-card-label" style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
                        Intern Dibimbing
                    </div>
                </div>
            </div>

            {/* Monthly Review Stats */}
            <div className="card">
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    color: '#1F2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <i className="ri-calendar-check-line" style={{ color: '#FF6B00' }}></i>
                    Review Bulan Ini
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="mentor-review-grid">
                    {/* Logbooks Reviewed */}
                    <div style={{
                        background: '#FFF7ED',
                        borderRadius: '16px',
                        padding: '25px',
                        border: '1px solid #FFEDD5'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: '#FF6B00',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <i className="ri-book-2-line" style={{ fontSize: '24px', color: 'white' }}></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1F2937', marginBottom: '4px' }}>
                                    {stats.reviewedLogbooksThisMonth}
                                </div>
                                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
                                    Logbook Telah Direview
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Reviewed */}
                    <div style={{
                        background: '#EFF6FF',
                        borderRadius: '16px',
                        padding: '25px',
                        border: '1px solid #DBEAFE'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: '#3B82F6',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <i className="ri-file-text-line" style={{ fontSize: '24px', color: 'white' }}></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1F2937', marginBottom: '4px' }}>
                                    {stats.reviewedPermissionsThisMonth}
                                </div>
                                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
                                    Perizinan Telah Direview
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcements Section */}
            <div style={{ marginTop: '30px' }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    color: '#1F2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <i className="ri-notification-3-line" style={{ color: '#FF6B00' }}></i>
                    Pengumuman Pusat
                </h3>

                {announcements.length === 0 ? (
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        color: '#9CA3AF',
                        border: '2px dashed #E5E7EB'
                    }}>
                        <i className="ri-chat-history-line" style={{ fontSize: '32px', marginBottom: '10px', display: 'block' }}></i>
                        Belum ada pengumuman terbaru.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {announcements.map((item) => (
                            <div key={item.id_announcements} style={{
                                background: 'white',
                                padding: '25px',
                                borderRadius: '20px',
                                border: '1px solid #F3F4F6',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                                borderLeft: '5px solid #3B82F6'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h4 style={{ margin: 0, fontWeight: '800', fontSize: '16px', color: '#111827' }}>{item.title}</h4>
                                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: '1.7' }}>{item.content}</p>
                                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#6B7280' }}>
                                        {item.author?.full_name?.charAt(0)}
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>Admin: {item.author?.full_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorDashboard;
