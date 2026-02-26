import React, { useState, useEffect } from 'react';
import { getAdminDashboard } from '../../services/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_active_interns: 0,
    total_mentors: 0,
    total_pending_logbooks: 0,
    total_pending_permissions: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAdminDashboard();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="section-view active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <i className="ri-loader-4-line rotating" style={{ fontSize: '48px', color: '#FF6B00' }}></i>
        <p style={{ marginTop: '15px', color: '#6B7280' }}>Memuat data dashboard...</p>
      </div>
    );
  }

  const chartData = {
    labels: ['Intern Aktif', 'Mentor', 'Logbook Pending', 'Izin Pending'],
    datasets: [
      {
        label: 'Jumlah',
        data: [
          stats.total_active_interns,
          stats.total_mentors,
          stats.total_pending_logbooks,
          stats.total_pending_permissions
        ],
        backgroundColor: [
          '#10B981', // green for intern active
          '#0EA5E9', // blue for mentor
          '#F97316', // orange for logbook
          '#EF4444'  // red for izin
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { size: 13, family: "'Inter', sans-serif" }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="section-view active" style={{ animation: 'fadeIn 0.5s ease', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 className="page-title" style={{ marginBottom: '5px', fontSize: '24px', fontWeight: 'bold' }}>Dashboard Admin</h2>
        <p className="page-subtitle" style={{ margin: 0, color: '#64748B' }}>Awasi aktivitas magang dan data user.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Total Interns (Active) */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontSize: '24px' }}>
            <i className="ri-user-star-line"></i>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '4px' }}>Peserta Magang Aktif</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>{stats.total_active_interns}</div>
          </div>
        </div>

        {/* Total Mentors */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', fontSize: '24px' }}>
            <i className="ri-team-line"></i>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '4px' }}>Total Mentor</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>{stats.total_mentors}</div>
          </div>
        </div>

        {/* Total Logbooks Pending */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', fontSize: '24px' }}>
            <i className="ri-book-mark-line"></i>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '4px' }}>Logbook Pending</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>{stats.total_pending_logbooks}</div>
          </div>
        </div>

        {/* Total Izin Pending */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontSize: '24px' }}>
            <i className="ri-mail-send-line"></i>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '4px' }}>Izin Pending</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>{stats.total_pending_permissions}</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', maxWidth: '500px', margin: '0' }}>
        <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '16px', color: '#0F172A' }}>Statistik Sistem</h3>
        <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
