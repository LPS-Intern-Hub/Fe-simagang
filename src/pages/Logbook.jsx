import React, { useState } from "react";
import api from "../services/api"; 

const Logbook = () => {
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    activity_detail: "",
    result_output: "",
    status: "sent" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/logbooks", formData);

      if (response.data.success) {
        alert(" Logbook berhasil");

        setFormData({ date: "", title: "", activity_detail: "", result_output: "", status: "sent" });
      }
    } catch (error) {
      console.error("Error simpan logbook:", error);

      alert(error.response?.data?.message || "Gagal menyambung ke server");
    }
  };

  return (
    <div className="section-view active">
      <h2 className="page-title">Logbook Harian</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="form-label">Judul Kegiatan</label>
              <input type="text" className="form-input" required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Tanggal</label>
              <input type="date" className="form-input" required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <label className="form-label">Detail Kegiatan</label>
            <textarea className="form-textarea" rows="4" required
              value={formData.activity_detail}
              onChange={(e) => setFormData({...formData, activity_detail: e.target.value})}></textarea>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label className="form-label">Output / Hasil</label>
            <textarea className="form-textarea" rows="3" required
              value={formData.result_output}
              onChange={(e) => setFormData({...formData, result_output: e.target.value})}></textarea>
          </div>

          <button type="submit" className="btn-scan" style={{ marginTop: '20px' }}>
            Kirim Logbook ke Database
          </button>
        </form>
      </div>
    </div>
  );
};

export default Logbook;