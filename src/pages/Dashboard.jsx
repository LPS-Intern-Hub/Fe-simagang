import React from 'react';

const Dashboard = () => {

  const data = {
    progress: '45%',
    hariBerjalan: 45,
    hariTersisa: 55,
    hadir: 18,
    logbook: 12
  };

  return (
    <div className="section-view active">
      <div className="hero-card">
        <div className="hero-content">
          <h2>Progress Magang</h2>
          <p>Periode: 1 Sep 2025 - 1 Des 2025</p>
          
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