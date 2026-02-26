import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, toggleUserStatus, resetUserPassword, createUser, updateUser } from '../../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

    // Create/Edit User State
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        role: 'intern',
        position: '',
        start_date: '',
        end_date: '',
        id_mentor: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [filterRole, page, searchQuery]);

    useEffect(() => {
        const fetchMentorsList = async () => {
            try {
                const resp = await getAllUsers({ role: 'mentor', limit: 100 });
                if (resp.data.success) {
                    setMentors(resp.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch mentors', err);
            }
        };
        fetchMentorsList();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                role: filterRole || undefined,
                search: searchQuery || undefined,
                page,
                limit: 10
            };
            const resp = await getAllUsers(params);
            if (resp.data.success) {
                setUsers(resp.data.data);
                if (resp.data.pagination) {
                    setPagination(resp.data.pagination);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        if (!window.confirm(`Konfirmasi perubahan role menjadi ${newRole}?`)) return;
        try {
            await updateUserRole(id, newRole);
            fetchUsers();
            alert('Role berhasil diperbarui');
        } catch (err) {
            alert('Gagal mengubah role');
        }
    };

    const handleToggleStatus = async (id, currentLocked) => {
        const isActive = currentLocked != null;
        const msg = isActive ? 'Aktifkan user ini?' : 'Nonaktifkan user ini?';
        if (!window.confirm(msg)) return;

        try {
            await toggleUserStatus(id, isActive);
            fetchUsers();
            alert(isActive ? 'User telah diaktifkan' : 'User telah dinonaktifkan');
        } catch (err) {
            alert('Gagal mengubah status');
        }
    };

    const handleResetPassword = async (id) => {
        if (!window.confirm('Reset password menjadi default (password123)?')) return;
        try {
            await resetUserPassword(id);
            alert('Password berhasil direset ke "password123"');
        } catch (err) {
            alert('Gagal reset password');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            if (editId) {
                await updateUser(editId, formData);
                alert('Akun berhasil diperbarui');
            } else {
                await createUser(formData);
                alert('Akun berhasil dibuat dengan password default "password123"');
            }
            setShowModal(false);
            setFormData({
                full_name: '',
                email: '',
                role: 'intern',
                position: '',
                start_date: '',
                end_date: '',
                id_mentor: ''
            });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || (editId ? 'Gagal memperbarui akun' : 'Gagal membuat akun'));
        } finally {
            setCreateLoading(false);
        }
    };

    const handleEditClick = (u) => {
        setEditId(u.id_users);

        let startDate = '';
        let endDate = '';
        let mentorId = '';

        if (u.role === 'intern' && u.internships && u.internships.length > 0) {
            const activeInternship = u.internships[0];
            if (activeInternship.start_date) {
                startDate = new Date(activeInternship.start_date).toISOString().split('T')[0];
            }
            if (activeInternship.end_date) {
                endDate = new Date(activeInternship.end_date).toISOString().split('T')[0];
            }
            mentorId = activeInternship.id_mentor || '';
        }

        setFormData({
            full_name: u.full_name || '',
            email: u.email || '',
            role: u.role || 'intern',
            position: u.position || '',
            start_date: startDate,
            end_date: endDate,
            id_mentor: mentorId
        });
        setShowModal(true);
    };

    const handleShowAddModal = () => {
        setEditId(null);
        setFormData({
            full_name: '',
            email: '',
            role: 'intern',
            position: '',
            start_date: '',
            end_date: '',
            id_mentor: ''
        });
        setShowModal(true);
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Manajemen User</h2>
            <p style={{ color: '#64748B', marginBottom: '20px' }}>Atur daftar user, tambah akun, ubah role, status, atau reset password.</p>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600' }}>Filter Role:</span>
                    <select
                        value={filterRole}
                        onChange={e => { setFilterRole(e.target.value); setPage(1); }}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}
                    >
                        <option value="">Semua</option>
                        <option value="intern">Intern</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                        <option value="kadiv">Kadiv</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Cari nama user..."
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}
                    />
                </div>
                <button
                    onClick={handleShowAddModal}
                    style={{ padding: '8px 16px', background: '#FF6B00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Tambah Akun
                </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B' }}>
                                    <th style={{ padding: '12px 16px' }}>Nama / Email</th>
                                    <th style={{ padding: '12px 16px' }}>Divisi</th>
                                    <th style={{ padding: '12px 16px' }}>Status</th>
                                    <th style={{ padding: '12px 16px' }}>Aksi Role</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Pengaturan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => {
                                    const isInactive = u.locked_until != null;
                                    return (
                                        <tr key={u.id_users} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ fontWeight: '600', color: '#0F172A' }}>{u.full_name}</div>
                                                <div style={{ fontSize: '13px', color: '#64748B' }}>{u.email}</div>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>{u.position || '-'}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    background: isInactive ? '#FEF2F2' : '#ECFDF5',
                                                    color: isInactive ? '#EF4444' : '#10B981',
                                                    padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold'
                                                }}>
                                                    {isInactive ? 'Nonaktif' : 'Aktif'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <select
                                                    value={u.role}
                                                    onChange={e => handleRoleChange(u.id_users, e.target.value)}
                                                    style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
                                                >
                                                    <option value="intern">Intern</option>
                                                    <option value="mentor">Mentor</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="kadiv">Kadiv</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px' }}>
                                                    <button
                                                        onClick={() => handleEditClick(u)}
                                                        style={{ padding: '6px 12px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(u.id_users, u.locked_until)}
                                                        style={{ padding: '6px 12px', background: isInactive ? '#10B981' : '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                    >
                                                        {isInactive ? 'Aktifkan' : 'Nonaktifkan'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(u.id_users)}
                                                        style={{ padding: '6px 12px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                    >
                                                        Reset Pass
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

                {/* Pagination Controls */}
                {!loading && pagination && (
                    <div className="pagination-container">
                        <button
                            className="pagination-btn"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            <i className="ri-arrow-left-s-line"></i> Previous
                        </button>
                        <span className="pagination-info">
                            Halaman {pagination.currentPage || 1} dari {Math.max(1, pagination.totalPages || 1)}
                        </span>
                        <button
                            className="pagination-btn"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= (pagination.totalPages || 1)}
                        >
                            Next <i className="ri-arrow-right-s-line"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Tambah/Edit Akun */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%', animation: 'slideUp 0.3s ease', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>{editId ? 'Edit Akun' : 'Tambah Akun Baru'}</h3>
                        <form onSubmit={handleSubmitUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Nama Lengkap *</label>
                                <input required type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Email *</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} disabled={!!editId} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Role *</label>
                                <select name="role" value={formData.role} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                                    <option value="intern">Intern</option>
                                    <option value="mentor">Mentor</option>
                                    <option value="admin">Admin</option>
                                    <option value="kadiv">Kadiv</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Divisi Magang / Jabatan</label>
                                <input type="text" name="position" value={formData.position} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                            </div>

                            {formData.role === 'intern' && (
                                <>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Start Date *</label>
                                            <input required type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>End Date *</label>
                                            <input required type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Pilih Mentor</label>
                                        <select name="id_mentor" value={formData.id_mentor} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                                            <option value="">-- Tanpa Mentor --</option>
                                            {mentors.map(m => (
                                                <option key={m.id_users} value={m.id_users}>{m.full_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', border: '1px solid #ccc', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>Batal</button>
                                <button type="submit" disabled={createLoading} style={{ padding: '10px 16px', border: 'none', borderRadius: '6px', background: '#FF6B00', color: '#fff', cursor: 'pointer' }}>
                                    {createLoading ? 'Menyimpan...' : 'Simpan Akun'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
