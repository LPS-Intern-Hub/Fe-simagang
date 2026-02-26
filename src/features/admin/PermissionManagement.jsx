import React, { useState, useEffect } from 'react';
import { getPermissions } from '../../services/api';

const PermissionManagement = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('pending'); // pending or history

    useEffect(() => {
        fetchPermissions();
    }, [tab]);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            // we have role admin so it will fetch everything matching the status. 
            // 'pending' for pending, 'approved,rejected' etc.. for history. But wait, `status` via API is a single string or enum. 
            // We can fetch two times or just fetch all and filter in frontend.
            const resp = await getPermissions();
            if (resp.data.success) {
                setPermissions(resp.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = permissions.filter(p => {
        if (tab === 'pending') return p.status === 'pending';
        return p.status !== 'pending'; // approved or rejected
    });

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Manajemen Izin</h2>
            <p style={{ color: '#64748B', marginBottom: '20px' }}>Daftar izin peserta magang.</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => setTab('pending')}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: tab === 'pending' ? '#FF6B00' : '#E2E8F0', color: tab === 'pending' ? '#fff' : '#64748B', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Pending
                </button>
                <button
                    onClick={() => setTab('history')}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: tab === 'history' ? '#FF6B00' : '#E2E8F0', color: tab === 'history' ? '#fff' : '#64748B', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    History
                </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Tidak ada perizinan {tab}.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B' }}>
                                <th style={{ padding: '12px 16px' }}>Nama / Email</th>
                                <th style={{ padding: '12px 16px' }}>Tipe</th>
                                <th style={{ padding: '12px 16px' }}>Timeline</th>
                                <th style={{ padding: '12px 16px' }}>Alasan</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id_permissions} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ fontWeight: '600', color: '#0F172A' }}>{p.internship?.user?.full_name || '-'}</div>
                                        <div style={{ fontSize: '13px', color: '#64748B' }}>{p.internship?.user?.email || '-'}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{p.type}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ fontSize: '12px', background: '#F1F5F9', padding: '4px 8px', borderRadius: '4px' }}>
                                            {new Date(p.start_date).toLocaleDateString()} - {new Date(p.end_date).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', maxWidth: '200px' }}>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{p.title}</div>
                                        <div style={{ fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.reason}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <span style={{
                                            background: p.status === 'approved' ? '#ECFDF5' : p.status === 'rejected' ? '#FEF2F2' : '#FFFBEB',
                                            color: p.status === 'approved' ? '#10B981' : p.status === 'rejected' ? '#EF4444' : '#F59E0B',
                                            padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold'
                                        }}>
                                            {p.status === 'approved' ? 'Disetujui' : p.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PermissionManagement;
