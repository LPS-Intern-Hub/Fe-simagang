import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getMentorInternships } from '../../../services/api';
import "remixicon/fonts/remixicon.css";

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id_internships: '',
        title: '',
        description: '',
        due_date: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [tasksRes, internsRes] = await Promise.all([
                getTasks(),
                getMentorInternships()
            ]);

            if (tasksRes.data.success) setTasks(tasksRes.data.data);
            if (internsRes.data.success) setInternships(internsRes.data.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (task = null) => {
        if (task) {
            setEditingId(task.id_tasks);
            setFormData({
                id_internships: task.id_internships,
                title: task.title,
                description: task.description || '',
                due_date: task.due_date ? task.due_date.split('T')[0] : ''
            });
        } else {
            setEditingId(null);
            setFormData({
                id_internships: internships.length > 0 ? internships[0].id_internships : '',
                title: '',
                description: '',
                due_date: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateTask(editingId, formData);
            } else {
                await createTask(formData);
            }
            setIsModalOpen(false);
            fetchInitialData();
        } catch (err) {
            console.error('Error saving task:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return;
        try {
            await deleteTask(id);
            fetchInitialData();
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'todo': return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0', icon: 'ri-time-line' };
            case 'in_progress': return { bg: '#FFF7ED', text: '#EA580C', border: '#FFEDD5', icon: 'ri-loader-2-line' };
            case 'completed': return { bg: '#F0FDF4', text: '#059669', border: '#BBF7D0', icon: 'ri-checkbox-circle-line' };
            default: return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0', icon: 'ri-time-line' };
        }
    };

    if (loading) {
        return (
            <div className="section-view active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loader-mentor" style={{ width: '40px', height: '40px', border: '3px solid #F3F3F3', borderTop: '3px solid #FF6B00', borderRadius: '50%', animation: 'spin-mentor 1s linear infinite', margin: '0 auto 15px' }}></div>
                    <p style={{ color: '#64748B', fontWeight: '500' }}>Memuat data bimbingan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="section-view active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px' }}>
                <div>
                    <h2 className="page-title" style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        Manajemen Tugas
                    </h2>
                    <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px' }}>
                        Berikan instruksi dan pantau progres kerja anak bimbingan Anda.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        background: '#FF6B00',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '14px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.3)',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <i className="ri-add-line" style={{ fontSize: '20px' }}></i> Tambah Tugas
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '24px', padding: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
                {tasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ width: '64px', height: '64px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: '#CBD5E1', fontSize: '32px' }}>
                            <i className="ri-draft-line"></i>
                        </div>
                        <p style={{ color: '#64748B', fontWeight: '500' }}>Belum ada tugas yang direncanakan.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 5px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={{ padding: '20px', color: '#94A3B8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Intern</th>
                                    <th style={{ padding: '20px', color: '#94A3B8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Tugas</th>
                                    <th style={{ padding: '20px', color: '#94A3B8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Deadline</th>
                                    <th style={{ padding: '20px', color: '#94A3B8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                                    <th style={{ padding: '20px', color: '#94A3B8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => {
                                    const style = getStatusStyle(task.status);
                                    return (
                                        <tr key={task.id_tasks} style={{ transition: 'background 0.2s' }}>
                                            <td style={{ padding: '15px 20px', borderTop: '1px solid #F8FAFC' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${task.internship?.user?.full_name}&background=random&color=fff&size=40`}
                                                        alt="Avatar"
                                                        style={{ width: '36px', height: '36px', borderRadius: '12px' }}
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '14px' }}>{task.internship?.user?.full_name}</div>
                                                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>{task.internship?.user?.position}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px 20px', borderTop: '1px solid #F8FAFC' }}>
                                                <div style={{ fontWeight: '700', color: '#334155', fontSize: '14px' }}>{task.title}</div>
                                                <div style={{ fontSize: '12px', color: '#64748B', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {task.description || 'Tidak ada deskripsi'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px 20px', borderTop: '1px solid #F8FAFC' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                                                    <i className="ri-calendar-line" style={{ color: '#94A3B8' }}></i>
                                                    {task.due_date ? new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px 20px', borderTop: '1px solid #F8FAFC' }}>
                                                <div style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '6px 14px',
                                                    borderRadius: '10px',
                                                    background: style.bg,
                                                    color: style.text,
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    border: `1px solid ${style.border}`
                                                }}>
                                                    <i className={style.icon}></i>
                                                    {task.status.replace('_', ' ').toUpperCase()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px 20px', borderTop: '1px solid #F8FAFC' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleOpenModal(task)}
                                                        style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#FFF7ED', color: '#EA580C', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onMouseOver={(e) => e.currentTarget.style.background = '#FFEDD5'}
                                                        onMouseOut={(e) => e.currentTarget.style.background = '#FFF7ED'}
                                                    >
                                                        <i className="ri-edit-line"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task.id_tasks)}
                                                        style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onMouseOver={(e) => e.currentTarget.style.background = '#FEE2E2'}
                                                        onMouseOut={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Premium Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, animation: 'fadeIn-mentor 0.3s ease'
                }}>
                    <div style={{
                        background: 'white', width: '560px', maxWidth: '95%',
                        borderRadius: '32px', padding: '35px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        position: 'relative', animation: 'slideUp-mentor 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1E293B' }}>
                                    {editingId ? 'Edit Identitas Tugas' : 'Buat Instruksi Baru'}
                                </h3>
                                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#64748B' }}>Detail tugas untuk anak bimbingan.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F8FAFC', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94A3B8' }}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#475569' }}>Pilih Peserta Magang</label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={formData.id_internships}
                                            onChange={(e) => setFormData({ ...formData, id_internships: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: '14px', appearance: 'none', background: '#FAFBFC' }}
                                        >
                                            <option value="">Pilih Intern...</option>
                                            {internships.map(i => (
                                                <option key={i.id_internships} value={i.id_internships}>
                                                    {i.user?.full_name} — {i.user?.position}
                                                </option>
                                            ))}
                                        </select>
                                        <i className="ri-arrow-down-s-line" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }}></i>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#475569' }}>Judul Tugas</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="Tuliskan tujuan utama tugas..."
                                        style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#FAFBFC' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#475569' }}>Detail Deskripsi (Opsional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Berikan langkah-langkah atau ekspektasi hasil..."
                                        style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: '14px', height: '120px', resize: 'none', background: '#FAFBFC' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#475569' }}>Batas Waktu</label>
                                    <input
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                        style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#FAFBFC' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', background: 'white', fontWeight: '700', color: '#64748B', cursor: 'pointer' }}>Batal</button>
                                <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: '#FF6B00', fontWeight: '800', color: 'white', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.2)' }}>
                                    {editingId ? 'Perbarui Tugas' : 'Konfirmasi & Kirim'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin-mentor { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes fadeIn-mentor { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp-mentor { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                tbody tr:hover { background: #F8FAFC; }
            `}</style>
        </div>
    );
};

export default TaskManager;
