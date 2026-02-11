import React, { useState, useEffect } from 'react';
import { getDashboard } from '../../../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [internshipData, setInternshipData] = useState(null);
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
        const response = await getDashboard();

        if (response.data.success) {
          const dashboardData = response.data.data;

          // Set user data
          setUserData(dashboardData.user);

          // Set internship data
          setInternshipData(dashboardData.internship_progress);

          // Set dashboard stats
          setData({
            progress: `${dashboardData.internship_progress.percentage}%`,
            hariBerjalan: dashboardData.internship_progress.days_passed,
            hariTersisa: dashboardData.internship_progress.days_remaining,
            hadir: dashboardData.attendance_this_month,
            logbook: dashboardData.logbook_filled
          });
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
    </div>
  );
};

export default Dashboard;