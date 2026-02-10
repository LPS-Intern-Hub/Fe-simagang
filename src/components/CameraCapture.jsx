import React, { useRef, useState, useEffect } from 'react';

const CameraCapture = ({ onCapture, onClose, location = 'Kantor Pusat' }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user' // Front camera
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '32px',
        width: '550px',
        height: '546px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            Ambil Foto
          </h3>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: 0,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Location */}
        <div style={{
          fontSize: '14px',
          color: '#666',
          marginTop: '-8px'
        }}>
          Lokasi: {location}
        </div>

        {/* Camera Preview Area */}
        <div style={{
          flex: 1,
          background: '#000',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {error ? (
            <div style={{
              textAlign: 'center',
              color: '#fff',
              padding: '20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(239, 68, 68, 0.2)',
                borderRadius: '50%'
              }}>
                <i className="ri-error-warning-line" style={{ fontSize: '40px', color: '#EF4444' }}></i>
              </div>
              <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)' // Mirror effect
                }}
              />
              {!cameraReady && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#fff'
                }}>
                  <i className="ri-loader-4-line rotating" style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }}></i>
                  <p style={{ margin: 0, fontSize: '14px' }}>Memuat kamera...</p>
                </div>
              )}
            </>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Button */}
        <button
          onClick={capturePhoto}
          disabled={!cameraReady || error}
          style={{
            padding: '14px 24px',
            background: (!cameraReady || error) ? '#D1D5DB' : '#FF6B00',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: (!cameraReady || error) ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            width: '100%'
          }}
        >
          {!cameraReady && !error ? 'Memuat Kamera...' : 'Ambil Foto'}
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
