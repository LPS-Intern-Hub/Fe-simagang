import React, { useState, useEffect } from "react";
import { getProfile, changePassword, updateProfile } from "../../../services/api";
import Modal from "../components/Modal";
import "remixicon/fonts/remixicon.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Bank form
  const [bankForm, setBankForm] = useState({
    bank_name: "",
    bank_account_number: "",
    bank_account_name: ""
  });
  const [bankLoading, setBankLoading] = useState(false);

  // Modals
  const [modal, setModal] = useState({ isOpen: false, type: "success", title: "", message: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      const data = response.data.data;
      setProfileData(data);
      setBankForm({
        bank_name: data.bank_name || "",
        bank_account_number: data.bank_account_number || "",
        bank_account_name: data.bank_account_name || ""
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      setModal({ isOpen: true, type: "error", title: "Gagal", message: "Password baru minimal 6 karakter" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setModal({ isOpen: true, type: "error", title: "Gagal", message: "Konfirmasi password tidak cocok" });
      return;
    }

    try {
      setPasswordLoading(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setModal({ isOpen: true, type: "success", title: "Berhasil!", message: "Password berhasil diubah" });
    } catch (err) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: err.response?.data?.message || "Gagal mengubah password"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdateBank = async (e) => {
    e.preventDefault();

    try {
      setBankLoading(true);
      const response = await updateProfile(bankForm);
      const updatedData = response.data.data;
      setProfileData(prev => ({ ...prev, ...updatedData }));
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...updatedData }));

      setModal({ isOpen: true, type: "success", title: "Berhasil!", message: "Informasi bank berhasil diperbarui" });
    } catch (err) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: err.response?.data?.message || "Gagal memperbarui informasi bank"
      });
    } finally {
      setBankLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-view active">
        <h2 className="page-title">Profil Saya</h2>
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-view active">
      <div style={{ marginBottom: '25px' }}>
        <h2 className="page-title" style={{ marginBottom: '8px' }}>Profil Saya</h2>
        <p style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: '500' }}>
          Kelola informasi akun dan data perbankan Anda
        </p>
      </div>

      {/* Profile Info Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <img
            src={
              user.avatar_url ||
              `https://ui-avatars.com/api/?name=${profileData?.full_name || 'User'}&background=FF6B00&color=fff&size=80`
            }
            alt="Avatar"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #FFF',
              boxShadow: '0 2px 12px rgba(255, 107, 0, 0.2)'
            }}
          />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1F2937' }}>
              {profileData?.full_name || 'User'}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6B7280' }}>
              {profileData?.email}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 12px',
                background: '#FFF7ED',
                color: '#FF6B00',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {profileData?.role}
              </span>
              {profileData?.position && (
                <span style={{
                  padding: '4px 12px',
                  background: '#F3F4F6',
                  color: '#4B5563',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {profileData.position}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#FFF7ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <i className="ri-lock-password-line" style={{ fontSize: '20px', color: '#FF6B00' }}></i>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1F2937' }}>Ubah Password</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>Pastikan password baru minimal 6 karakter</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Current Password */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', fontSize: '14px', marginBottom: '6px', color: '#374151' }}>
                Password Lama
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPw ? "text" : "password"}
                  className="form-input"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Masukkan password lama"
                  style={{ width: '100%', paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '18px'
                  }}
                >
                  <i className={showCurrentPw ? "ri-eye-off-line" : "ri-eye-line"}></i>
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', fontSize: '14px', marginBottom: '6px', color: '#374151' }}>
                Password Baru
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPw ? "text" : "password"}
                  className="form-input"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Masukkan password baru"
                  style={{ width: '100%', paddingRight: '44px' }}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '18px'
                  }}
                >
                  <i className={showNewPw ? "ri-eye-off-line" : "ri-eye-line"}></i>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', fontSize: '14px', marginBottom: '6px', color: '#374151' }}>
                Konfirmasi Password Baru
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPw ? "text" : "password"}
                  className="form-input"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Ulangi password baru"
                  style={{ width: '100%', paddingRight: '44px' }}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '18px'
                  }}
                >
                  <i className={showConfirmPw ? "ri-eye-off-line" : "ri-eye-line"}></i>
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            style={{
              marginTop: '20px',
              background: '#FF6B00',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: passwordLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: passwordLoading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <i className="ri-lock-line"></i>
            {passwordLoading ? 'Menyimpan...' : 'Ubah Password'}
          </button>
        </form>
      </div>

      {/* Bank Info Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <i className="ri-bank-line" style={{ fontSize: '20px', color: '#3B82F6' }}></i>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1F2937' }}>Informasi Rekening</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>Untuk keperluan pembayaran uang saku magang</p>
          </div>
        </div>

        <form onSubmit={handleUpdateBank}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Bank Name */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', fontSize: '14px', marginBottom: '6px', color: '#374151' }}>
                Nama Bank
              </label>
              <select
                className="form-input"
                value={bankForm.bank_name}
                onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                style={{ width: '100%', cursor: 'pointer' }}
              >
                <option value="">Pilih bank</option>
                <option value="BCA">BCA</option>
                <option value="BNI">BNI</option>
                <option value="BRI">BRI</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BSI">BSI</option>
                <option value="CIMB Niaga">CIMB Niaga</option>
                <option value="Bank Permata">Bank Permata</option>
                <option value="Bank Danamon">Bank Danamon</option>
                <option value="Bank Mega">Bank Mega</option>
                <option value="Bank BTPN">Bank BTPN</option>
                <option value="Bank Jago">Bank Jago</option>
                <option value="SeaBank">SeaBank</option>
                <option value="Bank Neo Commerce">Bank Neo Commerce</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', fontSize: '14px', marginBottom: '6px', color: '#374151' }}>
                Nomor Rekening
              </label>
              <input
                type="text"
                className="form-input"
                value={bankForm.bank_account_number}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setBankForm({ ...bankForm, bank_account_number: val });
                }}
                placeholder="Masukkan nomor rekening"
                style={{ width: '100%' }}
                inputMode="numeric"
              />
            </div>

            {/* Account Name */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', fontSize: '14px', marginBottom: '6px', color: '#374151' }}>
                Atas Nama
              </label>
              <input
                type="text"
                className="form-input"
                value={bankForm.bank_account_name}
                onChange={(e) => setBankForm({ ...bankForm, bank_account_name: e.target.value })}
                placeholder="Nama sesuai rekening"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Bank Info Preview */}
          {bankForm.bank_name && bankForm.bank_account_number && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Preview
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1F2937' }}>
                {bankForm.bank_name}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginTop: '2px', letterSpacing: '1px', fontFamily: 'monospace' }}>
                {bankForm.bank_account_number}
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                a.n. {bankForm.bank_account_name || '-'}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={bankLoading}
            style={{
              marginTop: '20px',
              background: '#3B82F6',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: bankLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: bankLoading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <i className="ri-save-line"></i>
            {bankLoading ? 'Menyimpan...' : 'Simpan Informasi Bank'}
          </button>
        </form>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
};

export default Profile;
