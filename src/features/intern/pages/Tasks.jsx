import React, { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus } from '../../../services/api';
import "remixicon/fonts/remixicon.css";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('todo');
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await getTasks();
            if (response.data.success) {
                setTasks(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Gagal memuat tugas. Silakan coba lagi nanti.');
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await updateTaskStatus(taskId, newStatus);
            if (response.data.success) {
                setTasks(prev => prev.map(t => t.id_tasks === taskId ? { ...t, status: newStatus } : t));
                if (selectedTask && selectedTask.id_tasks === taskId) {
                    setSelectedTask(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const filteredTasks = tasks.filter(t => t.status === filter);

    const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };

    const statusConfig = {
        todo: {
            label: 'To Do',
            color: '#64748B',
            bg: '#F8FAFC',
            border: '#E2E8F0',
            icon: 'ri-time-line'
        },
        in_progress: {
            label: 'In Progress',
            color: '#EA580C',
            bg: '#FFF7ED',
            border: '#FFEDD5',
            icon: 'ri-loader-2-line'
        },
        completed: {
            label: 'Completed',
            color: '#059669',
            bg: '#F0FDF4',
            border: '#BBF7D0',
            icon: 'ri-checkbox-circle-line'
        }
    };

    if (loading) {
        return (
            <div className="section-view active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid #F3F3F3', borderTop: '3px solid #FF6B00', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
                    <p style={{ color: '#64748B', fontWeight: '500' }}>Menyiapkan daftar tugas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="section-view active">
            {/* Header Section */}
            <div style={{ marginBottom: '30px' }}>
                <h2 className="page-title" style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                    Tugas & Project
                </h2>
                <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px' }}>
                    Pantau dan kelola progres tugas harian Anda dari mentor.
                </p>
            </div>

            {/* Stats Quick View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="card" style={{ padding: '20px', marginBottom: 0, border: 'none', background: 'white', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        <i className="ri-task-line"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>{stats.total}</div>
                        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Total Tugas</div>
                    </div>
                </div>
                <div className="card" style={{ padding: '20px', marginBottom: 0, border: 'none', background: 'white', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        <i className="ri-time-line"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>{stats.todo + stats.inProgress}</div>
                        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Belum Selesai</div>
                    </div>
                </div>
                <div className="card" style={{ padding: '20px', marginBottom: 0, border: 'none', background: 'white', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0FDF4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>{stats.completed}</div>
                        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Berhasil Selesai</div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'inline-flex',
                background: '#F1F5F9',
                padding: '5px',
                borderRadius: '12px',
                marginBottom: '30px'
            }}>
                {['todo', 'in_progress', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            background: filter === f ? 'white' : 'transparent',
                            color: filter === f ? '#FF6B00' : '#64748B',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: filter === f ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            textTransform: 'capitalize'
                        }}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Task Grid */}
            {filteredTasks.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '80px 40px',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
                    border: '1px dashed #E2E8F0'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#F8FAFC',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: '40px',
                        color: '#CBD5E1'
                    }}>
                        <i className="ri-inbox-line"></i>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#334155' }}>Tidak Ada Tugas</h3>
                    <p style={{ color: '#64748B', marginTop: '8px' }}>Belum ada tugas dalam kategori status ini.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
                    {filteredTasks.map(task => {
                        const config = statusConfig[task.status] || statusConfig.todo;
                        const isDeadlineSoon = task.due_date && new Date(task.due_date) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

                        return (
                            <div
                                key={task.id_tasks}
                                className="task-card-premium"
                                onClick={() => setSelectedTask(task)}
                                style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '24px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                    border: '1px solid #F1F5F9',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Status Indicator Bar */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '4px',
                                    height: '100%',
                                    background: config.color
                                }}></div>

                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        background: config.bg,
                                        color: config.color,
                                        fontSize: '12px',
                                        fontWeight: '800'
                                    }}>
                                        <i className={config.icon}></i>
                                        {config.label}
                                    </div>

                                    {task.due_date && (
                                        <div style={{
                                            fontSize: '12px',
                                            color: isDeadlineSoon && task.status !== 'completed' ? '#EF4444' : '#64748B',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <i className="ri-calendar-event-line"></i>
                                            {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: '#1E293B',
                                    marginBottom: '10px',
                                    lineHeight: '1.4'
                                }}>
                                    {task.title}
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#64748B',
                                    lineHeight: '1.6',
                                    marginBottom: '24px',
                                    flexGrow: 1,
                                    display: '-webkit-box',
                                    WebkitLineClamp: '3',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {task.description || 'Tidak ada deskripsi tambahan.'}
                                </p>

                                {/* Footer Info */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: 'auto'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#FF6B00' }}>
                                            <i className="ri-user-star-line"></i>
                                        </div>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{task.mentor?.full_name?.split(' ')[0] || 'Mentor'}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#FF6B00', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Detail <i className="ri-arrow-right-s-line"></i>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Task Detail Modal - Simplified */}
            {selectedTask && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', width: '500px', maxWidth: '90%',
                        borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #EEE', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#333' }}>Detail Tugas</h3>
                            <button
                                onClick={() => setSelectedTask(null)}
                                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999' }}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Judul Tugas:</div>
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedTask.title}</div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Deskripsi:</div>
                            <div style={{ fontSize: '14px', color: '#444', lineHeight: '1.5' }}>
                                {selectedTask.description || '-'}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Mentor:</div>
                                <div style={{ fontSize: '14px' }}>{selectedTask.mentor?.full_name}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Deadline:</div>
                                <div style={{ fontSize: '14px' }}>
                                    {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString('id-ID') : '-'}
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #EEE', paddingTop: '20px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Update Status:</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleStatusChange(selectedTask.id_tasks, 'todo')}
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #DDD', background: selectedTask.status === 'todo' ? '#F5F5F5' : 'white', cursor: 'pointer' }}
                                >
                                    To Do
                                </button>
                                <button
                                    onClick={() => handleStatusChange(selectedTask.id_tasks, 'in_progress')}
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #FFEDD5', background: selectedTask.status === 'in_progress' ? '#FFF7ED' : 'white', color: '#EA580C', cursor: 'pointer' }}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => handleStatusChange(selectedTask.id_tasks, 'completed')}
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#22C55E', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Animation Styles */}
            <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .task-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
        }
      `}</style>
        </div>
    );
};

export default Tasks;
