import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

const Presensi = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [type, setType] = useState(""); // 'in' atau 'out'
  const [absenIn, setAbsenIn] = useState("-- : --");
  const [absenOut, setAbsenOut] = useState("-- : --");

  const openCam = (mode) => {
    setType(mode);
    setIsCameraOpen(true);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (type === "in") {
      setAbsenIn(time);
    } else {
      setAbsenOut(time);
    }

    setIsCameraOpen(false);
    alert(`Absen ${type === "in" ? "Masuk" : "Pulang"} Berhasil jam ${time}`);
  }, [webcamRef, type]);

  return (
    <div className="section-view active">
      <h2 className="page-title">Presensi Kehadiran</h2>
      <p className="page-subtitle" style={{ marginBottom: "25px" }}>
        Jangan lupa scan wajah saat masuk dan pulang.
      </p>

      <div className="attendance-grid">
        {/* ABSEN MASUK */}
        <div className="absent-card">
          <div className="ac-icon">
            <i className="ri-sun-line"></i>
          </div>
          <div className="ac-title">Absen Masuk</div>
          <div className="ac-clock">{absenIn}</div>
          <div className="ac-loc">Lokasi: Kantor Pusat</div>
          <button
            className="btn-scan"
            onClick={() => openCam("in")}
            disabled={absenIn !== "-- : --"}
          >
            {absenIn === "-- : --" ? "Scan Wajah" : "Sudah Absen"}
          </button>
        </div>

        {/* ABSEN PULANG */}
        <div
          className="absent-card"
          style={{ opacity: absenIn === "-- : --" ? 0.6 : 1 }}
        >
          <div
            className="ac-icon"
            style={{ background: "#F3F4F6", color: "#9CA3AF" }}
          >
            <i className="ri-moon-line"></i>
          </div>
          <div className="ac-title">Absen Pulang</div>
          <div className="ac-clock">{absenOut}</div>
          <div className="ac-loc">Lokasi: Kantor Pusat</div>
          <button
            className="btn-scan"
            onClick={() => openCam("out")}
            disabled={absenIn === "-- : --" || absenOut !== "-- : --"}
          >
            {absenOut === "-- : --" ? "Scan Wajah" : "Sudah Absen"}
          </button>
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
              >
                Ambil Foto
              </button>
              <button
                className="btn-scan"
                style={{
                  background: "#E5E7EB",
                  color: "#374151",
                  width: "auto",
                }}
                onClick={() => setIsCameraOpen(false)}
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
