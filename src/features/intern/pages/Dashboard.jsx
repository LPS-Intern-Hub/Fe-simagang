import React, { useState, useEffect } from 'react';
import { getDashboard, getAnnouncements } from '../../../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [internshipData, setInternshipData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [data, setData] = useState({
    progress: '0%',
    hariBerjalan: 0,
    hariTersisa: 0,
    hadir: 0,
    logbook: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, announcementRes] = await Promise.all([
          getDashboard(),
          getAnnouncements({ role: 'intern' })
        ]);

        if (dashboardRes.data.success) {
          const dashboardData = dashboardRes.data.data;
          setUserData(dashboardData.user);
          setInternshipData(dashboardData.internship_progress);
          setData({
            progress: `${dashboardData.internship_progress.percentage}%`,
            hariBerjalan: dashboardData.internship_progress.days_passed,
            hariTersisa: dashboardData.internship_progress.days_remaining,
            hadir: dashboardData.attendance_this_month,
            logbook: dashboardData.logbook_filled
          });
        }

        if (announcementRes.data.success) {
          setAnnouncements(announcementRes.data.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.response?.data?.message || 'Gagal mengambil data dashboard');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date to Indonesian format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <div className="section-view active" style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-view active" style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="section-view active">
      {/* Progress Magang Card */}
      <div className="progress-card-white">
        <h2 className="progress-title">Progress Magang</h2>
        <p className="progress-period">
          Periode: {internshipData?.start_date && internshipData?.end_date
            ? `${formatDate(internshipData.start_date)} - ${formatDate(internshipData.end_date)}`
            : '1 Oktober 2026 - 31 Januari 2026'
          }
        </p>

        <div className="progress-wrapper-white">
          <div className="progress-track-white">
            <div className="progress-fill-white" style={{ width: data.progress }}></div>
          </div>
          <div className="progress-badge-orange">{data.progress}</div>
        </div>

        <div className="stats-grid-white">
          <div className="stat-box-light">
            <div className="stat-box-value">{data.hariBerjalan}</div>
            <div className="stat-box-label">Hari Berjalan</div>
          </div>
          <div className="stat-box-light">
            <div className="stat-box-value">{data.hariTersisa}</div>
            <div className="stat-box-label">Hari Tersisa</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Kartu Hadir Bulan Ini */}
        <div className="dashboard-stat-card">
          <div className="stat-icon-box" style={{ background: '#ECFDF5' }}>
            <img src="/images/hadirBulanIni.png" alt="Hadir" style={{ width: '41px', height: '41px', objectFit: 'contain' }} />
          </div>
          <div>
            <div className="stat-value">{data.hadir}</div>
            <div className="stat-label">Hadir Bulan Ini</div>
          </div>
        </div>

        {/* Kartu Logbook Terisi */}
        <div className="dashboard-stat-card">
          <div className="stat-icon-box" style={{ background: '#FFF7ED' }}>
            <img src="/images/logbookTerisi.png" alt="Logbook" style={{ width: '41px', height: '41px', objectFit: 'contain' }} />
          </div>
          <div>
            <div className="stat-value">{data.logbook}</div>
            <div className="stat-label">Logbook Terisi</div>
          </div>
        </div>
      </div>

      {/* Announcements Section */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#1F2937' }}>Pengumuman Terbaru</h3>
        {announcements.length === 0 ? (
          <div className="card" style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>
            Belum ada pengumuman untuk Anda.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {announcements.map((item) => (
              <div key={item.id_announcements} className="card" style={{ padding: '20px', borderLeft: '4px solid #FF6B00' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontWeight: 'bold', color: '#111827' }}>{item.title}</h4>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: '1.6' }}>{item.content}</p>
                <div style={{ marginTop: '10px', fontSize: '11px', fontWeight: 'bold', color: '#FF6B00' }}>
                  Oleh: {item.author?.full_name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;