import React, { useState, useEffect } from 'react';
import { getDashboard } from '../services/api';

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
      <div className="hero-card">
        <div className="hero-content">
          <h2>Progress Magang</h2>
          <p>
            Periode: {internshipData?.start_date && internshipData?.end_date 
              ? `${formatDate(internshipData.start_date)} - ${formatDate(internshipData.end_date)}`
              : 'Belum ada data periode magang'
            }
          </p>
          
          <div className="progress-wrapper">
            <div className="progress-track">
              {/* Width pakai data dinamis */}
              <div className="progress-fill" style={{ width: data.progress }}></div>
            </div>
            <div className="progress-badge">{data.progress}</div>
          </div>

          <div className="hero-stats">
            <div className="stat-box-transparent">
              <div className="sb-val">{data.hariBerjalan}</div>
              <div className="sb-label">Hari Berjalan</div>
            </div>
            <div className="stat-box-transparent">
              <div className="sb-val">{data.hariTersisa}</div>
              <div className="sb-label">Hari Tersisa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Kartu Presensi */}
        <div className="card" style={cardStyle}>
          <div style={{ ...iconBoxStyle, background: '#ECFDF5', color: '#10B981' }}>
            <i className="ri-check-double-line"></i>
          </div>
          <div>
            <div style={valStyle}>{data.hadir}</div>
            <div style={labelStyle}>Hadir Bulan Ini</div>
          </div>
        </div>

        {/* Kartu Logbook */}
        <div className="card" style={cardStyle}>
          <div style={{ ...iconBoxStyle, background: '#FFF7ED', color: 'var(--primary)' }}>
            <i className="ri-book-open-line"></i>
          </div>
          <div>
            <div style={valStyle}>{data.logbook}</div>
            <div style={labelStyle}>Logbook Terisi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styling Object agar JSX lebih bersih dibaca
const cardStyle = { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: 0 };
const iconBoxStyle = { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' };
const valStyle = { fontSize: '24px', fontWeight: 800 };
const labelStyle = { fontSize: '13px', color: '#666' };

export default Dashboard;