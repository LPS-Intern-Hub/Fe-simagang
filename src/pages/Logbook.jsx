import React, { useState, useEffect } from "react";
import {
  getLogbooks,
  createLogbook,
  updateLogbook,
  deleteLogbook
} from "../services/api";
import "remixicon/fonts/remixicon.css";

const Logbook = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    title: "",
    activity_detail: "",
    result_output: "",
    status: "sent"
  });

  useEffect(() => {
    fetchLogbooks();
  }, []);

  const fetchLogbooks = async () => {
    try {
      setLoading(true);
      const response = await getLogbooks();
      setLogbooks(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data logbook");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateLogbook(editId, formData);
        alert("Logbook berhasil diperbarui");
      } else {
        await createLogbook(formData);
        alert("Logbook berhasil disimpan");
      }

      setFormData({
        date: "",
        title: "",
        activity_detail: "",
        result_output: "",
        status: "sent"
      });
      setEditId(null);
      setShowForm(false);
      fetchLogbooks();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyimpan logbook");
    }
  };

  const handleEdit = (logbook) => {
    setEditId(logbook.id);
    setFormData({
      date: logbook.date?.slice(0, 10),
      title: logbook.title,
      activity_detail: logbook.activity_detail,
      result_output: logbook.result_output,
      status: logbook.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus logbook ini?")) return;
    try {
      await deleteLogbook(id);
      fetchLogbooks();
    } catch {
      alert("Gagal menghapus logbook");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: "Draft", color: "#6c757d" },
      sent: { label: "Dikirim", color: "#0d6efd" },
      in_review: { label: "Direview", color: "#ffc107" },
      approved: { label: "Disetujui", color: "#28a745" },
      rejected: { label: "Ditolak", color: "#dc3545" }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "500",
          backgroundColor: config.color + "20",
          color: config.color
        }}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

  if (loading) {
    return (
      <div className="section-view active">
        <h2 className="page-title">Logbook Harian</h2>
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-view active">
      <h2 className="page-title">Logbook Harian</h2>

      {error && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "8px"
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <button
          className="btn-scan"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
          }}
          style={{ marginBottom: "10px" }}
        >
          {showForm ? "❌ Tutup Form" : "➕ Buat Logbook Baru"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "20px", color: "var(--primary-color)" }}>
            Form Logbook
          </h3>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}
            >
              <div>
                <label className="form-label">Judul Kegiatan</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Tanggal</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <label className="form-label">Detail Kegiatan</label>
              <textarea
                className="form-textarea"
                rows="4"
                required
                value={formData.activity_detail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    activity_detail: e.target.value
                  })
                }
              />
            </div>

            <div style={{ marginTop: "15px" }}>
              <label className="form-label">Output / Hasil</label>
              <textarea
                className="form-textarea"
                rows="3"
                required
                value={formData.result_output}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    result_output: e.target.value
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="btn-scan"
              style={{ marginTop: "20px" }}
            >
              💾 Simpan Logbook
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: "20px", color: "var(--primary-color)" }}>
          Daftar Logbook
        </h3>

        {logbooks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <p>📝 Belum ada logbook. Buat logbook pertama Anda!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {logbooks.map((logbook) => (
              <div
                key={logbook.id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "20px",
                  backgroundColor: "#fafafa"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "10px"
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>
                      {logbook.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                      📅 {formatDate(logbook.date)}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    {getStatusBadge(logbook.status)}
                    <i
                      className="ri-edit-2-line"
                      style={{ cursor: "pointer", color: "#0d6efd" }}
                      onClick={() => handleEdit(logbook)}
                    />
                    <i
                      className="ri-delete-bin-line"
                      style={{ cursor: "pointer", color: "#dc3545" }}
                      onClick={() => handleDelete(logbook.id)}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "14px",
                      color: "#666",
                      fontWeight: "600"
                    }}
                  >
                    Detail Kegiatan:
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    {logbook.activity_detail}
                  </p>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "14px",
                      color: "#666",
                      fontWeight: "600"
                    }}
                  >
                    Hasil / Output:
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    {logbook.result_output}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logbook;
