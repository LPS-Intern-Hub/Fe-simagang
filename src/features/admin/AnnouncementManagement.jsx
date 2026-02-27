import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AnnouncementManagement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState({
        title: "",
        content: "",
        target_role: "all",
        start_date: "",
        end_date: ""
    });

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await api.get("/announcements");
            setAnnouncements(response.data.data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentAnnouncement.id_announcements) {
                await api.put(`/announcements/${currentAnnouncement.id_announcements}`, currentAnnouncement);
            } else {
                await api.post("/announcements", currentAnnouncement);
            }
            setIsModalOpen(false);
            setCurrentAnnouncement({ title: "", content: "", target_role: "all", start_date: "", end_date: "" });
            fetchAnnouncements();
        } catch (error) {
            console.error("Error saving announcement:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
            try {
                await api.delete(`/announcements/${id}`);
                fetchAnnouncements();
            } catch (error) {
                console.error("Error deleting announcement:", error);
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Manajemen Pengumuman</h2>
                    <p style={{ color: '#64748B', margin: '5px 0 0 0' }}>Buat dan kelola informasi untuk Intern & Mentor.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentAnnouncement({ title: "", content: "", target_role: "all", start_date: "", end_date: "" });
                        setIsModalOpen(true);
                    }}
                    style={{ background: '#FF6B00', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="ri-add-line"></i> Buat Pengumuman
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <i className="ri-loader-4-line rotating" style={{ fontSize: '32px', color: '#FF6B00' }}></i>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {announcements.map((item) => (
                        <div key={item.id_announcements} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{
                                    fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase',
                                    background: item.target_role === 'all' ? '#EFF6FF' : (item.target_role === 'intern' ? '#FFF7ED' : '#F3E8FF'),
                                    color: item.target_role === 'all' ? '#3B82F6' : (item.target_role === 'intern' ? '#F97316' : '#A855F7')
                                }}>
                                    {item.target_role}
                                </span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => {
                                        const announcement = { ...item };
                                        if (announcement.start_date) announcement.start_date = announcement.start_date.split('T')[0];
                                        if (announcement.end_date) announcement.end_date = announcement.end_date.split('T')[0];
                                        setCurrentAnnouncement(announcement);
                                        setIsModalOpen(true);
                                    }} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><i className="ri-edit-line"></i></button>
                                    <button onClick={() => handleDelete(item.id_announcements)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{item.title}</h3>
                            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5', marginBottom: '15px' }}>{item.content}</p>

                            {(item.start_date || item.end_date) && (
                                <div style={{ fontSize: '12px', color: '#FF6B00', background: '#FFF7ED', padding: '8px', borderRadius: '6px', marginBottom: '15px' }}>
                                    <i className="ri-calendar-line"></i> {item.start_date ? new Date(item.start_date).toLocaleDateString() : '?'} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : '∞'}
                                </div>
                            )}

                            <div style={{ fontSize: '11px', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Oleh: {item.author?.full_name}</span>
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 'bold' }}>{currentAnnouncement.id_announcements ? "Edit" : "Buat"} Pengumuman</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}><i className="ri-close-line"></i></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600' }}>Judul</label>
                                <input
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    value={currentAnnouncement.title}
                                    onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600' }}>Target</label>
                                <select
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    value={currentAnnouncement.target_role}
                                    onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, target_role: e.target.value })}
                                >
                                    <option value="all">Semua</option>
                                    <option value="intern">Intern</option>
                                    <option value="mentor">Mentor</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600' }}>Tgl Mulai</label>
                                    <input
                                        type="date"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                        value={currentAnnouncement.start_date || ""}
                                        onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, start_date: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600' }}>Tgl Berakhir</label>
                                    <input
                                        type="date"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                        value={currentAnnouncement.end_date || ""}
                                        onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, end_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600' }}>Isi</label>
                                <textarea
                                    required
                                    rows="5"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', resize: 'none' }}
                                    value={currentAnnouncement.content}
                                    onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Batal</button>
                                <button type="submit" style={{ flex: 1, padding: '12px', background: '#FF6B00', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementManagement;
