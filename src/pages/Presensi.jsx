import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { getTodayPresence, checkIn, checkOut, getPresences } from '../services/api';

const Presensi = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
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

  const openCam = (mode) => {
    setType(mode);
    setIsCameraOpen(true);
  };

  const capture = useCallback(async () => {
    setSubmitting(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (type === "in") {
      // Get current location
      if (!navigator.geolocation) {
        alert('Geolocation tidak didukung oleh browser Anda');
        setSubmitting(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Convert base64 to blob
            const blob = await fetch(imageSrc).then(r => r.blob());
            const formData = new FormData();
            formData.append('image', blob, 'checkin.jpg');
            formData.append('latitude', position.coords.latitude.toString());
            formData.append('longitude', position.coords.longitude.toString());
            formData.append('location', 'Kantor Pusat Jakarta');
            
            const response = await checkIn(formData);
            
            if (response.data.success) {
              const time = new Date().toLocaleTimeString('id-ID', { hour: "2-digit", minute: "2-digit" });
              setAbsenIn(time);
              setLocationIn('Kantor Pusat Jakarta');
              setIsCameraOpen(false);
              alert(`✅ ${response.data.message} jam ${time}`);
              await fetchTodayPresence();
              await fetchPresenceHistory();
            }
          } catch (error) {
            console.error('Check-in error:', error);
            const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat melakukan check-in';
            alert(`❌ ${errorMsg}`);
          } finally {
            setSubmitting(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('❌ Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.');
          setSubmitting(false);
        }
      );
    } else {
      // Get current location for checkout
      if (!navigator.geolocation) {
        alert('Geolocation tidak didukung oleh browser Anda');
        setSubmitting(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Convert base64 to blob
            const blob = await fetch(imageSrc).then(r => r.blob());
            const formData = new FormData();
            formData.append('image', blob, 'checkout.jpg');
            formData.append('latitude', position.coords.latitude.toString());
            formData.append('longitude', position.coords.longitude.toString());
            formData.append('location', 'Kantor Pusat Jakarta');
            
            const response = await checkOut(formData);
            
            if (response.data.success) {
              const time = new Date().toLocaleTimeString('id-ID', { hour: "2-digit", minute: "2-digit" });
              setAbsenOut(time);
              setLocationOut('Kantor Pusat Jakarta');
              setIsCameraOpen(false);
              alert(`✅ ${response.data.message} jam ${time}`);
              await fetchTodayPresence();
              await fetchPresenceHistory();
            }
          } catch (error) {
            console.error('Check-out error:', error);
            const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat melakukan check-out';
            alert(`❌ ${errorMsg}`);
          } finally {
            setSubmitting(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('❌ Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.');
          setSubmitting(false);
        }
      );
    }
  }, [webcamRef, type]);

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
        <div className="attendance-grid">
          {/* ABSEN MASUK */}
          <div className="absent-card">
            <div className="ac-icon">
              <i className="ri-sun-line"></i>
            </div>
            <div className="ac-title">Absen Masuk</div>
            <div className="ac-clock">{absenIn}</div>
            <div className="ac-loc">Lokasi: {locationIn}</div>
            <button
              className="btn-scan"
              onClick={() => openCam("in")}
              disabled={absenIn !== "--:--"}
              style={{
                background: absenIn === "--:--" ? '#1F2937' : '#E5E7EB',
                color: absenIn === "--:--" ? 'white' : '#9CA3AF'
              }}
            >
              {absenIn === "--:--" ? "Absen Masuk" : "Sudah Absen"}
            </button>
          </div>

          {/* ABSEN PULANG */}
          <div
            className="absent-card"
            style={{ opacity: absenIn === "--:--" ? 0.6 : 1 }}
          >
            <div
              className="ac-icon"
              style={{ 
                background: absenIn !== "--:--" ? '#FFF7ED' : '#F3F4F6', 
                color: absenIn !== "--:--" ? '#FF6B00' : '#9CA3AF' 
              }}
            >
              <i className="ri-moon-line"></i>
            </div>
            <div className="ac-title">Absen Pulang</div>
            <div className="ac-clock">{absenOut}</div>
            <div className="ac-loc">Lokasi: {locationOut}</div>
            <button
              className="btn-scan"
              onClick={() => openCam("out")}
              disabled={absenIn === "--:--" || absenOut !== "--:--"}
              style={{
                background: (absenIn !== "--:--" && absenOut === "--:--") ? '#1F2937' : '#E5E7EB',
                color: (absenIn !== "--:--" && absenOut === "--:--") ? 'white' : '#9CA3AF'
              }}
            >
              {absenOut === "--:--" ? "Absen Pulang" : "Sudah Absen"}
            </button>
          </div>
        </div>
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

      {/* MODAL KAMERA */}
      {isCameraOpen && (
        <div className="modal-overlay open">
          <div className="modal-content" style={{ textAlign: "center" }}>
            <h3>Ambil Foto Presensi</h3>
            <div
              style={{
                margin: "20px 0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                style={{ width: "100%", transform: "scaleX(-1)" }}
              />
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                className="btn-scan"
                style={{ background: "var(--primary)", width: "auto" }}
                onClick={capture}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="ri-loader-4-line rotating"></i>
                    Memproses...
                  </>
                ) : (
                  <>
                    <i className="ri-camera-fill"></i>
                    Ambil Foto
                  </>
                )}
              </button>
              <button
                className="btn-scan"
                style={{
                  background: "#E5E7EB",
                  color: "#374151",
                  width: "auto",
                }}
                onClick={() => setIsCameraOpen(false)}
                disabled={submitting}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Presensi;
