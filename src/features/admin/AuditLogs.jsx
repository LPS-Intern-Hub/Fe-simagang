import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ action: "", entity: "" });

    const fetchLogs = async (page = 1) => {
        try {
            setLoading(true);
            const params = { ...filters, page, limit: 15 };
            const response = await api.get("/audit-logs", { params });
            setLogs(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Error fetching audit logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1);
    }, [filters]);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Log Aktivitas</h2>
                    <p style={{ color: '#64748B', margin: '5px 0 0 0' }}>Jejak audit tindakan sistem.</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <select
                        style={{ border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', padding: '0 10px', outline: 'none' }}
                        value={filters.action}
                        onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                    >
                        <option value="">Semua Aksi</option>
                        <option value="LOGIN">LOGIN</option>
                        <option value="CREATE">CREATE</option>
                        <option value="UPDATE">UPDATE</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    <div style={{ width: '1px', background: '#E2E8F0' }}></div>
                    <select
                        style={{ border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', padding: '0 10px', outline: 'none' }}
                        value={filters.entity}
                        onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                    >
                        <option value="">Semua Modul</option>
                        <option value="users">User</option>
                        <option value="presensi">Presensi</option>
                        <option value="announcements">Pengumuman</option>
                    </select>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#F8FAFC' }}>
                        <tr>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>Waktu</th>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>User</th>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>Aksi</th>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>Detail</th>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}><i className="ri-loader-4-line rotating" style={{ color: '#FF6B00' }}></i></td></tr>
                        ) : logs.map((log) => (
                            <tr key={log.id_audit_logs} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '15px 20px', fontSize: '13px' }}>
                                    <div>{new Date(log.created_at).toLocaleDateString()}</div>
                                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(log.created_at).toLocaleTimeString()}</div>
                                </td>
                                <td style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '600' }}>{log.user?.full_name || 'System'}</td>
                                <td style={{ padding: '15px 20px' }}>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px',
                                        background: log.action.includes('DELETE') ? '#FEF2F2' : (log.action.includes('CREATE') ? '#ECFDF5' : '#F8FAFC'),
                                        color: log.action.includes('DELETE') ? '#EF4444' : (log.action.includes('CREATE') ? '#10B981' : '#64748B')
                                    }}>
                                        {log.action}
                                    </span>
                                </td>
                                <td style={{ padding: '15px 20px', fontSize: '13px', color: '#64748B' }}>
                                    <div style={{ fontWeight: '600', color: '#334155' }}>{log.entity}</div>
                                    <div style={{ fontSize: '12px' }}>{log.details}</div>
                                </td>
                                <td style={{ padding: '15px 20px', fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace' }}>{log.ip_address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>Halaman {pagination.page} dari {pagination.totalPages}</div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button disabled={pagination.page <= 1} onClick={() => fetchLogs(pagination.page - 1)} style={{ padding: '5px 10px', border: '1px solid #E2E8F0', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}><i className="ri-arrow-left-s-line"></i></button>
                        <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchLogs(pagination.page + 1)} style={{ padding: '5px 10px', border: '1px solid #E2E8F0', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}><i className="ri-arrow-right-s-line"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
