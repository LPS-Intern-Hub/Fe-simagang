import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { getTodayPresence, checkIn, checkOut } from '../services/api';

const Presensi = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [type, setType] = useState(""); // 'in' atau 'out'
  const [absenIn, setAbsenIn] = useState("-- : --");
  const [absenOut, setAbsenOut] = useState("-- : --");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [todayPresence, setTodayPresence] = useState(null);

  // Fetch today's presence on mount
  useEffect(() => {
    fetchTodayPresence();
  }, []);

  const fetchTodayPresence = async () => {
    try {
      setLoading(true);
      const response = await getTodayPresence();
      if (response.data.success && response.data.data) {
        const presence = response.data.data;
        setTodayPresence(presence);
        
        // Set check-in time if exists
        if (presence.check_in) {
          const checkInTime = new Date(presence.check_in);
          setAbsenIn(checkInTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        }
        
        // Set check-out time if exists
        if (presence.check_out) {
          const checkOutTime = new Date(presence.check_out);
          setAbsenOut(checkOutTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
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
              setIsCameraOpen(false);
              alert(`✅ ${response.data.message} jam ${time}`);
              await fetchTodayPresence();
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
              setIsCameraOpen(false);
              alert(`✅ ${response.data.message} jam ${time}`);
              await fetchTodayPresence();
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

  return (
    <div className="section-view active">
      <h2 className="page-title">Presensi Kehadiran</h2>
      <p className="page-subtitle" style={{ marginBottom: "25px" }}>
        Jangan lupa scan wajah saat masuk dan pulang.
      </p>

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
            <div className="ac-loc">Lokasi: Kantor Pusat Jakarta</div>
            <button
              className="btn-scan"
              onClick={() => openCam("in")}
              disabled={absenIn !== "-- : --"}
            >
              {absenIn === "-- : --" ? (
                <>
                  <i className="ri-camera-line"></i>
                  Scan Wajah
                </>
              ) : (
                <>
                  <i className="ri-checkbox-circle-line"></i>
                  Sudah Absen
                </>
              )}
            </button>
          </div>

          {/* ABSEN PULANG */}
          <div
            className="absent-card"
            style={{ opacity: absenIn === "-- : --" ? 0.6 : 1 }}
          >
            <div
              className="ac-icon"
              style={{ 
                background: absenIn !== "-- : --" ? '#FFF7ED' : '#F3F4F6', 
                color: absenIn !== "-- : --" ? '#FF6B00' : '#9CA3AF' 
              }}
            >
              <i className="ri-moon-line"></i>
            </div>
            <div className="ac-title">Absen Pulang</div>
            <div className="ac-clock">{absenOut}</div>
            <div className="ac-loc">Lokasi: Kantor Pusat Jakarta</div>
            <button
              className="btn-scan"
              onClick={() => openCam("out")}
              disabled={absenIn === "-- : --" || absenOut !== "-- : --"}
            >
              {absenOut === "-- : --" ? (
                <>
                  <i className="ri-camera-line"></i>
                  Scan Wajah
                </>
              ) : (
                <>
                  <i className="ri-checkbox-circle-line"></i>
                  Sudah Absen
                </>
              )}
            </button>
          </div>
        </div>
      )}

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
