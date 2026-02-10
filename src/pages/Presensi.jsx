import React, { useState, useEffect } from "react";
import { getTodayPresence, checkIn, checkOut, getPresences } from '../services/api';
import CameraCapture from '../components/CameraCapture';
import Modal from '../components/Modal';

const Presensi = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [type, setType] = useState(""); // 'in' atau 'out'
  const [absenIn, setAbsenIn] = useState("--:--");
  const [absenOut, setAbsenOut] = useState("--:--");
  const [locationIn, setLocationIn] = useState("-");
  const [locationOut, setLocationOut] = useState("-");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [todayPresence, setTodayPresence] = useState(null);
  const [presenceHistory, setPresenceHistory] = useState([]);
  const [isHoveringAbsen, setIsHoveringAbsen] = useState(false);
  const [modal, setModal] = useState({ 
    isOpen: false, 
    type: 'success', 
    title: '', 
    message: '',
    customImage: null
  });

  // Fetch today's presence on mount
  useEffect(() => {
    fetchTodayPresence();
    fetchPresenceHistory();
  }, []);

  const fetchPresenceHistory = async () => {
    try {
      const response = await getPresences({ limit: 10 });
      console.log('Presence history response:', response.data);
      if (response.data.success) {
        setPresenceHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching presence history:', error);
    }
  };

  const fetchTodayPresence = async () => {
    try {
      setLoading(true);
      const response = await getTodayPresence();
      console.log('Today presence response:', response.data);
      if (response.data.success && response.data.data) {
        const presence = response.data.data;
        setTodayPresence(presence);

        // Set check-in time if exists
        if (presence.check_in) {
          const checkInTime = new Date(presence.check_in);
          setAbsenIn(checkInTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
          setLocationIn(presence.checkin_location || '-');
        }

        // Set check-out time if exists
        if (presence.check_out) {
          const checkOutTime = new Date(presence.check_out);
          setAbsenOut(checkOutTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
          setLocationOut(presence.checkout_location || '-');
        }
      }
    } catch (error) {
      console.error('Error fetching today presence:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCamera = (mode) => {
    setType(mode);
    setIsCameraOpen(true);
  };

  const handleModalClose = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleCameraCapture = async (photoBlob) => {
    setIsCameraOpen(false);
    setSubmitting(true);

    // Get current location
    if (!navigator.geolocation) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Geolocation Tidak Didukung',
        message: 'Browser Anda tidak mendukung geolocation',
        customImage: null
      });
      setSubmitting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const formData = new FormData();
          formData.append('image', photoBlob, type === 'in' ? 'checkin.jpg' : 'checkout.jpg');
          formData.append('latitude', position.coords.latitude.toString());
          formData.append('longitude', position.coords.longitude.toString());
          formData.append('location', 'Kantor Pusat Jakarta');

          const apiCall = type === 'in' ? checkIn : checkOut;
          const response = await apiCall(formData);

          if (response.data.success) {
            const time = new Date().toLocaleTimeString('id-ID', { hour: "2-digit", minute: "2-digit" });
            if (type === 'in') {
              setAbsenIn(time);
              setLocationIn('Kantor Pusat Jakarta');
            } else {
              setAbsenOut(time);
              setLocationOut('Kantor Pusat Jakarta');
            }
            setModal({
              isOpen: true,
              type: 'success',
              title: type === 'in' ? 'Absen Masuk Berhasil!' : 'Absen Pulang Berhasil!',
              message: `${response.data.message} pada ${time}`,
              customImage: null
            });
            await fetchTodayPresence();
            await fetchPresenceHistory();
          }
        } catch (error) {
          console.error('Check-in/out error:', error);
          const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat melakukan presensi';
          
          // Check if error is about location being too far
          const isLocationError = errorMsg.toLowerCase().includes('jangkauan') || 
                                 errorMsg.toLowerCase().includes('jauh') ||
                                 errorMsg.toLowerCase().includes('radius') ||
                                 errorMsg.toLowerCase().includes('lokasi');
          
          setModal({
            isOpen: true,
            type: 'error',
            title: isLocationError ? 'Lokasi di Luar Jangkauan' : 'Absensi Gagal',
            message: errorMsg,
            customImage: isLocationError ? '/images/absenJauh.png' : null
          });
        } finally {
          setSubmitting(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Gagal Mendapatkan Lokasi',
          message: 'Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.',
          customImage: null
        });
        setSubmitting(false);
      }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const time = new Date(timeString);
    return time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentDate = () => {
    const date = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[date.getDay()];
    return `${dayName}, ${formatDate(date)}`;
  };

  return (
    <div className="section-view active">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
        <div>
          <h2 className="page-title">Presensi Kehadiran</h2>
          <p className="page-subtitle">
            Jangan lupa check-in dan check-out
          </p>
        </div>
        <div style={{ textAlign: 'right', color: '#6B7280', fontSize: '14px' }}>
          {getCurrentDate()}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <i className="ri-loader-4-line rotating" style={{ fontSize: '48px', color: '#FF6B00' }}></i>
          <p style={{ marginTop: '15px', color: '#6B7280' }}>Memuat data presensi...</p>
        </div>
      ) : (
        <>
          {/* Presensi Card */}
          <div className="card" style={{ marginBottom: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '30px', marginBottom: '30px' }}>
              {/* ABSEN MASUK */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FFF7ED',
                  borderRadius: '50%'
                }}>
                  <img
                    src="/images/absenMasuk.png"
                    alt="Jam Masuk"
                    style={{ width: '39px', height: '39px', objectFit: 'contain' }}
                  />
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#64748B',
                  marginBottom: '12px'
                }}>
                  Absen Masuk
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#1F2937',
                  marginBottom: '8px',
                  letterSpacing: '1px'
                }}>
                  {absenIn}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  background: '#F3F4F6',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  display: 'inline-block'
                }}>
                  Lokasi: {locationIn}
                </div>
              </div>

              {/* Divider */}
              <div style={{ background: '#E5E7EB', width: '1px' }}></div>

              {/* ABSEN PULANG */}
              <div style={{ textAlign: 'center', opacity: absenIn === "--:--" ? 0.5 : 1 }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FFF7ED',
                  borderRadius: '50%'
                }}>
                  <img
                    src="/images/absenPulang.png"
                    alt="Jam Pulang"
                    style={{ width: '39px', height: '39px', objectFit: 'contain' }}
                  />
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#64748B',
                  marginBottom: '12px'
                }}>
                  Absen Pulang
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#1F2937',
                  marginBottom: '8px',
                  letterSpacing: '1px'
                }}>
                  {absenOut}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  background: '#F3F4F6',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  display: 'inline-block'
                }}>
                  Lokasi: {locationOut}
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => handleOpenCamera(absenIn === "--:--" ? "in" : "out")}
              onMouseEnter={() => setIsHoveringAbsen(true)}
              onMouseLeave={() => setIsHoveringAbsen(false)}
              disabled={(absenIn !== "--:--" && absenOut !== "--:--") || submitting}
              style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                display: 'block',
                padding: '14px',
                borderRadius: '12px',
                border: absenIn === "--:--" ? 'none' : (absenOut !== "--:--" || submitting) ? '2px solid #E5E7EB' : '2px solid #EF4444',
                background: absenIn === "--:--" ? '#2C3E50' : (absenOut !== "--:--" || submitting) ? '#F3F4F6' : (isHoveringAbsen && absenOut === "--:--" ? '#FF0000' : 'white'),
                color: absenIn === "--:--" ? 'white' : (absenOut !== "--:--" || submitting) ? '#9CA3AF' : (isHoveringAbsen && absenOut === "--:--" ? '#FFFFFF' : '#EF4444'),
                fontSize: '15px',
                fontWeight: '600',
                cursor: (absenIn !== "--:--" && absenOut !== "--:--") || submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {submitting
                ? "Memproses..."
                : absenIn === "--:--"
                  ? "Absen Masuk"
                  : absenOut === "--:--"
                    ? "Absen Pulang"
                    : "Sudah Absen Hari Ini"
              }
            </button>
          </div>
        </>
      )}

      {/* RIWAYAT ABSENSI */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#1F2937' }}>
          Riwayat Absensi
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="clean-table">
            <thead>
              <tr>
                <th>TANGGAL</th>
                <th>MASUK</th>
                <th>KELUAR</th>
                <th>LOKASI</th>
              </tr>
            </thead>
            <tbody>
              {presenceHistory.length > 0 ? (
                presenceHistory.map((presence, index) => (
                  <tr key={presence.id_presensi || index}>
                    <td>{formatDate(presence.date)}</td>
                    <td>{formatTime(presence.check_in)}</td>
                    <td>{formatTime(presence.check_out)}</td>
                    <td>{presence.checkin_location || presence.checkout_location || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>
                    Belum ada riwayat absensi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Camera Capture Modal */}
      {isCameraOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      )}

      {/* Success/Error Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={handleModalClose}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        customImage={modal.customImage}
      />
    </div>
  );
};

export default Presensi;
