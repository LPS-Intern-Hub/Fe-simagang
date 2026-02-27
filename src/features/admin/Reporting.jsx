import React, { useState } from "react";
import api from "../../services/api";

const Reporting = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [downloading, setDownloading] = useState({ presensi: false, logbook: false });

    const handleExport = async (type) => {
        try {
            setDownloading({ ...downloading, [type]: true });
            const response = await api.get("/reports/export", {
                params: { type, month: selectedMonth, year: selectedYear },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan_${type.toUpperCase()}_${selectedMonth}_${selectedYear}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Error exporting ${type}:`, error);
            alert("Gagal mengunduh laporan.");
        } finally {
            setDownloading({ ...downloading, [type]: false });
        }
    };

    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Pusat Laporan</h2>
                <p style={{ color: '#64748B', margin: '5px 0 0 0' }}>Ekspor data presensi dan logbook ke Excel.</p>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', maxWidth: '600px' }}>
                <div style={{ marginBottom: '25px', display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Pilih Bulan</label>
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                            {months.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Pilih Tahun</label>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <button
                        onClick={() => handleExport('presensi')}
                        disabled={downloading.presensi}
                        style={{ padding: '15px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: downloading.presensi ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        <i className="ri-file-excel-2-line"></i> {downloading.presensi ? "Mengunduh..." : "Export Presensi"}
                    </button>
                    <button
                        onClick={() => handleExport('logbook')}
                        disabled={downloading.logbook}
                        style={{ padding: '15px', background: '#FF6B00', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: downloading.logbook ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        <i className="ri-book-mark-line"></i> {downloading.logbook ? "Mengunduh..." : "Export Logbook"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reporting;
