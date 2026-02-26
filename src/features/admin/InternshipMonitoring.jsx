import React, { useState, useEffect } from 'react';
import { getAllInternships } from '../../services/api';

const InternshipMonitoring = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        setLoading(true);
        try {
            const resp = await getAllInternships('');
            if (resp.data.success) {
                setInternships(resp.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const calculateProgress = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const today = new Date();

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        let daysPassed = 0;
        if (today >= startDate) {
            daysPassed = Math.min(
                Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1,
                totalDays
            );
        }

        const daysRemaining = Math.max(totalDays - daysPassed, 0);

        return { totalDays, daysPassed, daysRemaining };
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Monitoring Internship</h2>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>Lihat daftar peserta magang, progress kehadiran, dan rekap aktivitas mereka.</p>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    Loading data monitoring...
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {internships.map(i => {
                        const progress = calculateProgress(i.start_date, i.end_date);
                        const progressPercent = progress.totalDays > 0 ? Math.round((progress.daysPassed / progress.totalDays) * 100) : 0;
                        const logbookCount = i._count?.logbooks || 0;
                        const izinCount = i._count?.permissions || 0;
                        const kehadiranCount = i._count?.presensi || 0;

                        return (
                            <div key={i.id_internships} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 15px -3px rgb(0 0 0 / 0.05)', display: 'flex', flexDirection: 'column' }}>
                                {/* Card Header */}
                                <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0F172A' }}>{i.user?.full_name || '-'}</h3>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>{i.user?.position || '-'}</p>
                                        </div>
                                        <span style={{
                                            background: i.status === 'aktif' ? '#ECFDF5' : (i.status === 'selesai' ? '#EFF6FF' : '#FEF2F2'),
                                            color: i.status === 'aktif' ? '#10B981' : (i.status === 'selesai' ? '#3B82F6' : '#EF4444'),
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize'
                                        }}>
                                            {i.status}
                                        </span>
                                    </div>
                                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                            <i className="ri-user-star-line"></i>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mentor Pembimbing</div>
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{i.mentor?.full_name || <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>Belum ada mentor</span>}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div style={{ padding: '20px', background: '#F8FAFC' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                        <span style={{ fontWeight: '600', color: '#334155' }}>Progress Waktu</span>
                                        <span style={{ fontWeight: 'bold', color: '#FF6B00' }}>{progressPercent}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #FF6B00, #F59E0B)', borderRadius: '4px' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: '#64748B' }}>
                                        <span>{new Date(i.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                        <span>{progress.daysPassed} hari berjalan</span>
                                        <span>{new Date(i.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                    <div style={{ background: '#FFF7ED', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'column', textAlign: 'center' }}>
                                        <div style={{ background: '#FFEDD5', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C', fontSize: '16px' }}>
                                            <i className="ri-book-read-line"></i>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#9A3412', lineHeight: '1' }}>{logbookCount}</div>
                                            <div style={{ fontSize: '10px', color: '#C2410C', marginTop: '4px', fontWeight: '500' }}>Logbook</div>
                                        </div>
                                    </div>
                                    <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'column', textAlign: 'center' }}>
                                        <div style={{ background: '#FEE2E2', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', fontSize: '16px' }}>
                                            <i className="ri-calendar-event-line"></i>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#991B1B', lineHeight: '1' }}>{izinCount}</div>
                                            <div style={{ fontSize: '10px', color: '#B91C1C', marginTop: '4px', fontWeight: '500' }}>Izin/Sakit</div>
                                        </div>
                                    </div>
                                    <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'column', textAlign: 'center' }}>
                                        <div style={{ background: '#DCFCE7', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', fontSize: '16px' }}>
                                            <i className="ri-user-check-line"></i>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#14532D', lineHeight: '1' }}>{kehadiranCount}</div>
                                            <div style={{ fontSize: '10px', color: '#15803D', marginTop: '4px', fontWeight: '500' }}>Kehadiran</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default InternshipMonitoring;
