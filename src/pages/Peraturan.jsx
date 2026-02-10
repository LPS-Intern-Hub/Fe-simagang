import React from "react";

// Icon Components
const ShirtIcon = ({ color = "#FFFFFF", accentColor = "#3B82F6" }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12L20 18V24L16 28V54C16 55.1046 16.8954 56 18 56H46C47.1046 56 48 55.1046 48 54V28L44 24V18L32 12Z" fill={color} stroke={accentColor} strokeWidth="2"/>
    <path d="M20 18L24 24V28H40V24L44 18" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="32" cy="18" r="4" fill={accentColor}/>
  </svg>
);

const BatikIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12L20 18V24L16 28V54C16 55.1046 16.8954 56 18 56H46C47.1046 56 48 55.1046 48 54V28L44 24V18L32 12Z" fill="#FED7AA" stroke="#EA580C" strokeWidth="2"/>
    <path d="M20 18L24 24V28H40V24L44 18" stroke="#EA580C" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="32" cy="18" r="4" fill="#EA580C"/>
    {/* Batik Pattern */}
    <circle cx="26" cy="32" r="2" fill="#C2410C" opacity="0.6"/>
    <circle cx="38" cy="32" r="2" fill="#C2410C" opacity="0.6"/>
    <circle cx="26" cy="40" r="2" fill="#C2410C" opacity="0.6"/>
    <circle cx="38" cy="40" r="2" fill="#C2410C" opacity="0.6"/>
    <circle cx="32" cy="36" r="2" fill="#C2410C" opacity="0.6"/>
    <circle cx="32" cy="44" r="2" fill="#C2410C" opacity="0.6"/>
    <path d="M24 30L28 34M36 30L40 34M24 38L28 42M36 38L40 42" stroke="#C2410C" strokeWidth="1" opacity="0.4"/>
  </svg>
);

const ColorfulShirtIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="colorful" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED7C3"/>
        <stop offset="50%" stopColor="#FDBA74"/>
        <stop offset="100%" stopColor="#FED7AA"/>
      </linearGradient>
    </defs>
    <path d="M32 12L20 18V24L16 28V54C16 55.1046 16.8954 56 18 56H46C47.1046 56 48 55.1046 48 54V28L44 24V18L32 12Z" fill="url(#colorful)" stroke="#F97316" strokeWidth="2"/>
    <path d="M20 18L24 24V28H40V24L44 18" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="32" cy="18" r="4" fill="#F97316"/>
  </svg>
);

const PoloShirtIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12L20 18V24L16 28V54C16 55.1046 16.8954 56 18 56H46C47.1046 56 48 55.1046 48 54V28L44 24V18L32 12Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
    <path d="M20 18L24 22V26H28V30H36V26H40V22L44 18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 26V30H36V26" fill="#3B82F6"/>
    <circle cx="32" cy="18" r="4" fill="#3B82F6"/>
    {/* Collar stripes */}
    <rect x="30" y="32" width="4" height="2" fill="#2563EB" opacity="0.3"/>
    <rect x="30" y="36" width="4" height="2" fill="#2563EB" opacity="0.3"/>
  </svg>
);

const Peraturan = () => {
  return (
    <div className="section-view active">
      {/* Header */}
      <div style={{ marginBottom: '25px' }}>
        <h2 className="page-title" style={{ marginBottom: '8px' }}>Jam Kerja & Dresscode</h2>
        <p className="page-subtitle" style={{ color: '#9CA3AF', fontSize: '14px' }}>
          Panduan profesionalitas selama menjalani masa magang di LPS.
        </p>
      </div>

      {/* Jam Kerja Section */}
      <div className="card" style={{ marginBottom: '20px', border: '1px solid rgba(255, 107, 0, 0.35)' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          marginBottom: '24px', 
          textAlign: 'center',
          color: '#1F2937'
        }}>
          Jam Kerja
        </h3>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '20px'
        }}>
          {/* Total Jam Kerja */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.35)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.22)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/images/totalJamKerja.png"
                alt="Total Jam Kerja"
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
              />
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              TOTAL JAM KERJA
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '4px'
            }}>
              8 Jam
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9CA3AF'
            }}>
              (Di luar istirahat)
            </div>
          </div>

          {/* Jam Masuk */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.35)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.22)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/images/jamMasuk.png"
                alt="Jam Masuk"
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
              />
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              JAM MASUK (FLEXI)
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '4px'
            }}>
              07.30 - 09.00
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9CA3AF'
            }}>
              WIB
            </div>
          </div>

          {/* Jam Istirahat */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.35)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.22)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/images/jamIstirahat.png"
                alt="Jam Istirahat"
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
              />
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              JAM ISTIRAHAT
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '4px'
            }}>
              12.00 - 13.00
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9CA3AF'
            }}>
              WIB
            </div>
          </div>
        </div>
      </div>

      {/* Dresscode Section */}
      <div className="card" style={{ border: '1px solid rgba(255, 107, 0, 0.35)' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          marginBottom: '24px', 
          textAlign: 'center',
          color: '#1F2937'
        }}>
          Dresscode
        </h3>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '16px'
        }}>
          {/* Senin - Kemeja Putih */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.35)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.22)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              textTransform: 'uppercase'
            }}>
              SENIN
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShirtIcon color="#FFFFFF" accentColor="#64748B" />
            </div>
            <div style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '6px'
            }}>
              Kemeja Putih
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6B7280',
              lineHeight: '1.5'
            }}>
              Kemeja/Blouse Putih, Bawahan Bahan, Sepatu Formal
            </div>
          </div>

          {/* Selasa - Batik */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.35)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.22)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              textTransform: 'uppercase'
            }}>
              SELASA
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BatikIcon />
            </div>
            <div style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '6px'
            }}>
              Batik
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6B7280',
              lineHeight: '1.5'
            }}>
              Baju Batik Rapi, Bawahan Bahan, Sepatu Formal
            </div>
          </div>

          {/* Rabu - Warna Terang */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.35)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.22)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              textTransform: 'uppercase'
            }}>
              RABU
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ColorfulShirtIcon />
            </div>
            <div style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '6px'
            }}>
              Warna terang
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6B7280',
              lineHeight: '1.5'
            }}>
              Kemeja Warna Terang, Bawahan Bahan,
            </div>
          </div>

          {/* Kamis - Terang/Batik */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.35)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.22)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              textTransform: 'uppercase'
            }}>
              KAMIS
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShirtIcon color="#FEF3C7" accentColor="#F59E0B" />
            </div>
            <div style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '6px'
            }}>
              Terang/Batik
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6B7280',
              lineHeight: '1.5'
            }}>
              Bebas rapi (Kemeja/ Batik), Bawahan Bahan,
            </div>
          </div>

          {/* Jumat - Smart Casual */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.35)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.22)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              textTransform: 'uppercase'
            }}>
              JUMAT
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PoloShirtIcon />
            </div>
            <div style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '6px'
            }}>
              Smart Casual
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6B7280',
              lineHeight: '1.5'
            }}>
              Kaos Berkerah (Polo), Jeans Gelap (No Ripped)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Peraturan;
