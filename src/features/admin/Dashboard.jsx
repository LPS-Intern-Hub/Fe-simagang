import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboard, getAllInternships } from '../../services/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_active_interns: 0,
    total_mentors: 0,
    total_pending_logbooks: 0,
    total_pending_permissions: 0
  });
  const [endingSoon, setEndingSoon] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, internsRes] = await Promise.all([
          getAdminDashboard(),
          getAllInternships()
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        if (internsRes.data.success) {
          const today = new Date();
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);

          const filtered = internsRes.data.data.filter(i => {
            if (i.status !== 'aktif') return false;
            const endDate = new Date(i.end_date);
            return endDate >= today && endDate <= nextWeek;
          });
          setEndingSoon(filtered);
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
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
          '#10B981',
          '#3B82F6',
          '#F97316',
          '#EF4444'
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
          font: { size: 13 }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '5px', fontSize: '24px', fontWeight: 'bold' }}>Dashboard Admin</h2>
        <p style={{ margin: 0, color: '#64748B' }}>Awasi aktivitas magang dan data user secara real-time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Total Interns */}
        <div
          onClick={() => navigate('/admin/internships')}
          style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', cursor: 'pointer' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontSize: '24px' }}>
            <i className="ri-user-star-line"></i>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Peserta Magang Aktif</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>{stats.total_active_interns}</div>
          </div>
        </div>

        {/* Total Mentors */}
        <div
          onClick={() => navigate('/admin/users')}
          style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', cursor: 'pointer' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontSize: '24px' }}>
            <i className="ri-team-line"></i>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Total Mentor</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>{stats.total_mentors}</div>
          </div>
        </div>

        {/* Pending Logbooks */}
        <div
          onClick={() => navigate('/admin/internships')}
          style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', cursor: 'pointer' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', fontSize: '24px' }}>
            <i className="ri-book-mark-line"></i>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Logbook Pending</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>{stats.total_pending_logbooks}</div>
          </div>
        </div>

        {/* Pending Permissions */}
        <div
          onClick={() => navigate('/admin/permissions')}
          style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', cursor: 'pointer' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontSize: '24px' }}>
            <i className="ri-mail-send-line"></i>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Izin Pending</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>{stats.total_pending_permissions}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>Statistik Sistem</h3>
          <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>Magang Akan Selesai (7 Hari)</h3>
          {endingSoon.length === 0 ? (
            <div style={{ color: '#64748B', fontSize: '14px', fontStyle: 'italic', padding: '10px 0' }}>Tidak ada peserta yang akan selesai.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F1F5F9', textAlign: 'left' }}>
                    <th style={{ padding: '10px', fontSize: '12px', color: '#64748B' }}>Nama</th>
                    <th style={{ padding: '10px', fontSize: '12px', color: '#64748B' }}>Posisi</th>
                    <th style={{ padding: '10px', fontSize: '12px', color: '#64748B' }}>Selesai</th>
                  </tr>
                </thead>
                <tbody>
                  {endingSoon.map(intern => (
                    <tr key={intern.id_internships} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px', fontSize: '14px', fontWeight: '600' }}>{intern.user?.full_name}</td>
                      <td style={{ padding: '10px', fontSize: '13px', color: '#64748B' }}>{intern.user?.position}</td>
                      <td style={{ padding: '10px', fontSize: '13px', color: '#EF4444' }}>
                        {new Date(intern.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
