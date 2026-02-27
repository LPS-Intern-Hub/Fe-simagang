import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AttendanceMonitoring = () => {
    const [presences, setPresences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [filterStatus, setFilterStatus] = useState("");

    const fetchPresences = async () => {
        try {
            setLoading(true);
            const params = { month: selectedMonth, year: selectedYear, status: filterStatus };
            const response = await api.get("/presences/admin", { params });
            setPresences(response.data.data);
        } catch (error) {
            console.error("Error fetching presences:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPresences();
    }, [selectedMonth, selectedYear, filterStatus]);

    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Monitoring Absensi</h2>
                    <p style={{ color: '#64748B', margin: '5px 0 0 0' }}>Data kehadiran seluruh peserta magang.</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', outline: 'none' }}>
                        {months.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', outline: 'none' }}>
                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <div style={{ width: '1px', background: '#E2E8F0' }}></div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', outline: 'none' }}>
                        <option value="">Status</option>
                        <option value="hadir">Hadir</option>
                        <option value="terlambat">Telat</option>
                        <option value="izin">Izin</option>
                    </select>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#F8FAFC' }}>
                        <tr>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>Intern</th>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>Tanggal</th>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>Check-In</th>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>Check-Out</th>
                            <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}><i className="ri-loader-4-line rotating" style={{ color: '#FF6B00' }}></i></td></tr>
                        ) : presences.map((p) => (
                            <tr key={p.id_presensi} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.internship.user.full_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>{p.internship.user.position}</div>
                                </td>
                                <td style={{ padding: '15px 20px', fontSize: '13px' }}>{new Date(p.date).toLocaleDateString()}</td>
                                <td style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '600' }}>{p.check_in ? new Date(p.check_in).toLocaleTimeString() : '-'}</td>
                                <td style={{ padding: '15px 20px', fontSize: '13px', color: '#64748B' }}>{p.check_out ? new Date(p.check_out).toLocaleTimeString() : '-'}</td>
                                <td style={{ padding: '15px 20px' }}>
                                    <span style={{
                                        fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px',
                                        background: p.status === 'hadir' ? '#ECFDF5' : (p.status === 'terlambat' ? '#FFF7ED' : '#F8FAFC'),
                                        color: p.status === 'hadir' ? '#10B981' : (p.status === 'terlambat' ? '#F97316' : '#64748B'),
                                        textTransform: 'capitalize'
                                    }}>
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceMonitoring;
