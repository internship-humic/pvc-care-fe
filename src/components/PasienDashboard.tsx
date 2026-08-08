import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PasienDashboard({ userData }: { userData: any }) {
  const userName = userData?.patient_profile?.name || userData?.profile?.name || userData?.name || 'Pasien';
  const [summary, setSummary] = useState<any>(null);
  const [lastScan, setLastScan] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States untuk popup Detail dan Edukasi
  const [selectedScan, setSelectedScan] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEduOpen, setIsEduOpen] = useState(false);

  const getDoctorImage = (photo?: string) => {
    if (!photo) return "https://placehold.co/100x100/e2e8f0/64748b?text=DR";
    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }
    const prefix = photo.startsWith("/") ? "" : "/";
    return `http://localhost:8000${prefix}${photo}`;
  };

  const getFormattedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getFormattedTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [sumRes, histRes] = await Promise.all([
          fetch('http://localhost:8000/api/pvc-scans/history/summary', { 
            headers: { 'Authorization': `Bearer ${token}` } 
          }),
          fetch('http://localhost:8000/api/pvc-scans/history', { 
            headers: { 'Authorization': `Bearer ${token}` } 
          })
        ]);

        if (sumRes.ok) {
          const resData = await sumRes.json();
          setSummary(resData.data);
        }

        if (histRes.ok) {
          const resData = await histRes.json();
          const scans = resData.data?.data || resData.data || [];
          setScanHistory(scans);
          if (scans.length > 0) {
            setLastScan(scans[0]);
          }
        }
      } catch (error) {
        console.error("Error loading patient dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Symptoms helper
  const getSymptomsList = () => {
    if (!lastScan?.symptoms) return [];
    if (Array.isArray(lastScan.symptoms)) return lastScan.symptoms;
    if (typeof lastScan.symptoms === 'string') {
      return lastScan.symptoms.split(',').map((s: string) => s.trim());
    }
    return [];
  };
  const activeSymptoms = getSymptomsList();
  const isSymptomActive = (symptomName: string, key: string) => {
    return activeSymptoms.some((s: string) => 
      s.toLowerCase().includes(symptomName.toLowerCase()) || 
      s.toLowerCase().includes(key.toLowerCase())
    );
  };

  // Extract unique doctors
  const getUniqueDoctors = () => {
    const seen = new Set();
    const list: any[] = [];
    scanHistory.forEach(scan => {
      const docName = scan?.doctor?.name;
      if (docName && !seen.has(docName)) {
        seen.add(docName);
        list.push({
          name: docName,
          profile_photo: scan.doctor?.profile_photo || '/docter1.png',
          specialization: scan.doctor?.specialization || 'Spesialis Jantung'
        });
      }
    });
    return list;
  };
  const uniqueDoctors = getUniqueDoctors();

  // Custom SVG Chart Calculation
  const renderTrendChart = () => {
    const chartScans = [...scanHistory].reverse().slice(-6); // Max 6 oldest-to-newest
    if (chartScans.length < 2) {
      return (
        <div className="h-64 flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-sm">Data belum cukup untuk menampilkan tren (minimal 2 pemeriksaan)</p>
        </div>
      );
    }

    const minBpm = 40;
    const maxBpm = 140;
    const bpmRange = maxBpm - minBpm;
    const height = 240;
    const width = 600;
    const padX = 50;
    const padY = 30;
    const chartHeight = height - 2 * padY - 20;
    const chartWidth = width - 2 * padX;

    const points = chartScans.map((scan, i) => {
      const bpm = scan.bpm || scan.avg_bpm || 75;
      const x = padX + (i * chartWidth) / (chartScans.length - 1);
      const clampedBpm = Math.max(minBpm, Math.min(maxBpm, bpm));
      const y = height - padY - 20 - ((clampedBpm - minBpm) * chartHeight) / bpmRange;
      return { x, y, bpm, date: scan.created_at };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padY - 20} L ${points[0].x} ${height - padY - 20} Z`;

    const gridLines = [60, 80, 100, 120];

    return (
      <div className="relative h-64 w-full">
        {/* Grid lines background */}
        <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-400 pb-10">
          <div className="border-b border-dashed border-gray-100 h-0 w-full flex items-center justify-end pr-2">120</div>
          <div className="border-b border-dashed border-gray-100 h-0 w-full flex items-center justify-end pr-2">100</div>
          <div className="border-b border-dashed border-gray-100 h-0 w-full flex items-center justify-end pr-2">80</div>
          <div className="border-b border-dashed border-gray-100 h-0 w-full flex items-center justify-end pr-2">60</div>
          <div className="border-b border-dashed border-gray-100 h-0 w-full flex items-center justify-end pr-2">40</div>
          <div className="h-0 w-full flex items-center justify-end pr-2">0</div>
        </div>

        {/* SVG Drawing */}
        <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full pb-8 overflow-visible">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4a90e2" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4a90e2" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#chartGrad)" />

          {/* Line Path */}
          <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points & Labels */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={5} className="fill-white stroke-[#4a90e2] stroke-[3px] shadow-sm cursor-pointer" />
              <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[10px] font-extrabold fill-slate-800 font-sans">{p.bpm}</text>
              
              {/* Date labels */}
              <text x={p.x} y={height - padY} textAnchor="middle" className="text-[10px] font-bold fill-gray-400 font-sans">
                {new Date(p.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#4a90e2] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-semibold animate-pulse font-sans">Memuat dashboard Anda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* ==================== GREETING SECTION ==================== */}
      <div className="mb-8" data-purpose="greeting-section">
        <h2 className="text-2xl font-semibold text-gray-500 font-sans">Hi, {userName} 👋</h2>
        <h1 className="text-3xl font-bold text-gray-800 mt-1 font-sans">Pemeriksaan Terakhir</h1>
      </div>

      {/* ==================== TOP CARDS ROW ==================== */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        
        {/* Main ECG Card */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-3xl border-2 border-blue-200 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] p-6 relative overflow-hidden" data-purpose="ecg-main-result">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-[#2c5da7] font-sans">Premature Ventricular Contractions</h3>
            <button 
              onClick={() => {
                if (lastScan) {
                  setSelectedScan(lastScan);
                  setIsDetailOpen(true);
                }
              }}
              className="px-4 py-1.5 border border-blue-400 text-[#4a90e2] rounded-full text-sm font-medium hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Lihat Hasil
            </button>
          </div>
          
          {/* Simulation of ECG Grid */}
          <div 
            className="w-full h-48 bg-white border border-red-100 rounded-xl relative"
            style={{
              backgroundImage: 'linear-gradient(to right, #fee2e2 1px, transparent 1px), linear-gradient(to bottom, #fee2e2 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(to right, #fecaca 0.5px, transparent 0.5px), linear-gradient(to bottom, #fecaca 0.5px, transparent 0.5px)',
                backgroundSize: '4px 4px'
              }}
            ></div>
            
            {/* Waveform / Real ECG Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              {lastScan?.document_url ? (
                <Image 
                  src={`http://localhost:8000${lastScan.document_url}`} 
                  alt="ECG Graph" 
                  width={600} 
                  height={300} 
                  className="w-full h-full object-contain opacity-90" 
                  unoptimized 
                />
              ) : (
                <svg className="w-full h-full text-gray-800 opacity-80" preserveAspectRatio="none" viewBox="0 0 800 200">
                  <path d="M0,100 L50,100 L60,80 L70,120 L80,100 L150,100 L165,20 L180,180 L195,100 L300,100 L310,80 L320,120 L330,100 L400,100 L415,20 L430,180 L445,100 L550,100 L560,80 L570,120 L580,100 L650,100 L665,20 L680,180 L695,100 L800,100" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                </svg>
              )}
            </div>

            {/* Status Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Status Analisis AI</p>
                <p className="text-sm font-bold text-gray-800">
                  {lastScan?.ai_result === 'PVC' ? 'PVC Terdeteksi' : 'Normal'}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full text-white ${
                lastScan?.verification_status === 'Verified' ? 'bg-[#22c55e]' : 'bg-amber-500'
              }`}>
                {lastScan?.verification_status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Notes Card */}
        <div 
          onClick={() => {
            if (lastScan) {
              setSelectedScan(lastScan);
              setIsDetailOpen(true);
            }
          }}
          className="col-span-12 lg:col-span-3 bg-[#4a90e2] rounded-3xl shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] p-6 text-white relative flex flex-col justify-between cursor-pointer hover:bg-blue-600/95 transition duration-300"
          data-purpose="doctor-notes"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <span className="bg-white text-[#4a90e2] px-4 py-1 rounded-full text-xs font-bold font-sans">
              Catatan Dokter
            </span>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-lg font-sans">{lastScan?.doctor?.name || "Belum ada verifikator"}</h4>
            <p className="text-sm opacity-90 mt-2 leading-relaxed line-clamp-6 font-sans">
              {lastScan?.doctor_note || "Hasil pemeriksaan Anda sedang menunggu verifikasi oleh dokter spesialis jantung. Informasi catatan medis akan muncul setelah proses verifikasi selesai."}
            </p>
          </div>
        </div>

        {/* History Card */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-3xl border-2 border-blue-100 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] p-6" data-purpose="history-summary">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#2c5da7] font-sans">Riwayat</h3>
            <button className="text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
            </button>
          </div>
          <div className="space-y-4">
            {scanHistory.length === 0 ? (
              <div className="text-center py-10 text-gray-300 text-sm">Belum ada riwayat</div>
            ) : (
              scanHistory.slice(0, 3).map((scan, idx) => (
                <div key={scan.id || idx}>
                  {idx > 0 && <hr className="border-gray-100 my-4" />}
                  <div 
                    onClick={() => {
                      setSelectedScan(scan);
                      setIsDetailOpen(true);
                    }}
                    className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition duration-200"
                  >
                    <div className="w-12 h-12 bg-blue-50 text-[#4a90e2] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{formatDate(scan.created_at)}</p>
                      <p className={`text-xs ${scan.ai_result === 'PVC' ? 'text-[#4a90e2] font-bold' : 'text-gray-400'}`}>
                        {scan.ai_result === 'PVC' ? 'PVC Terdeteksi' : 'Normal'}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-[#4a90e2] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ==================== STATS ROW ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Checks */}
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-100 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 border-4 border-blue-200 rounded-full flex items-center justify-center text-[#4a90e2] shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 font-sans">Total Pemeriksaan</p>
            <p className="text-3xl font-bold text-gray-800 font-sans">{summary?.total_scans || 0}</p>
            {scanHistory.length > 0 && (
              <p className="text-[10px] text-gray-400 font-sans">Sejak {formatDate(scanHistory[scanHistory.length - 1].created_at)}</p>
            )}
          </div>
        </div>

        {/* Average BPM */}
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-100 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] flex items-center gap-4">
          <div className="w-16 h-16 bg-red-50 border-4 border-red-100 rounded-full flex items-center justify-center text-red-400 shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 font-sans">Rata-rata BPM</p>
            <p className="text-3xl font-bold text-gray-800 font-sans">{summary?.avg_bpm || (lastScan?.bpm || 75)}</p>
            <p className="text-[10px] text-[#22c55e] font-sans font-bold">Normal BPM (60-100 BPM)</p>
          </div>
        </div>

        {/* AI Confidence */}
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-100 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] flex items-center gap-4">
          <div className="w-16 h-16 bg-green-50 border-4 border-green-100 rounded-full flex items-center justify-center text-[#22c55e] shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040 12.02 12.02 0 002.53 12.427m1.27 2.291A12.001 12.001 0 0012 21.32a12.001 12.001 0 008.818-4.303M15 10l-4 4-2-2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 font-sans">AI Confidence</p>
            <p className="text-3xl font-bold text-gray-800 font-sans">{summary?.avg_confidence || (lastScan?.confidence || 0)}%</p>
            <p className="text-[10px] text-[#22c55e] font-sans font-bold">Tingkat akurasi tinggi</p>
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-100 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-50 border-4 border-orange-100 rounded-full flex items-center justify-center text-orange-400 shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040 12.02 12.02 0 002.53 12.427m1.27 2.291A12.001 12.001 0 0012 21.32a12.001 12.001 0 008.818-4.303M15 10l-4 4-2-2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 font-sans">Tingkat Risiko</p>
            <p className={`text-3xl font-bold font-sans ${
              lastScan?.risk_level === 'High' ? 'text-red-500' : 'text-[#22c55e]'
            }`}>
              {lastScan?.risk_level || (lastScan?.ai_result === 'PVC' ? 'Tinggi' : 'Rendah')}
            </p>
            <p className="text-[10px] text-gray-400 font-sans">Risiko kardiovaskular</p>
          </div>
        </div>

      </div>

      {/* ==================== CHART & INSIGHTS ROW ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border-2 border-blue-100 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] p-6" data-purpose="pvc-trend-chart">
          <h3 className="text-xl font-bold text-[#2c5da7] mb-6 font-sans">Tren PVC Pasien</h3>
          {renderTrendChart()}
        </div>

        {/* Insight AI */}
        <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] p-6 flex flex-col" data-purpose="ai-insights">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 text-[#4a90e2] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-[#2c5da7] font-sans">Insight AI</h3>
          </div>
          <div className="bg-blue-50 rounded-2xl p-5 border-l-4 border-[#4a90e2] flex-1 overflow-auto">
            <p className="text-xs text-[#2c5da7] leading-relaxed mb-4 font-sans font-medium">
              {lastScan?.ai_result === 'PVC'
                ? 'Sistem AI kami mendeteksi aktivitas Premature Ventricular Contractions (PVC) dalam grafik EKG Anda. Ritme yang tidak teratur ini menunjukkan adanya ketukan tambahan dari bilik bawah jantung Anda.'
                : 'Analisis kecerdasan buatan (AI) menunjukkan ritme jantung Anda saat ini stabil dan berada dalam batas normal. Tidak terdeteksi adanya indikasi PVC.'}
            </p>
            <p className="text-xs font-bold text-[#2c5da7] uppercase tracking-wider mb-2 font-sans">Rekomendasi:</p>
            <p className="text-xs text-[#2c5da7] leading-relaxed font-sans font-medium">
              {lastScan?.ai_result === 'PVC'
                ? 'Kurangi asupan stimulan seperti kafein, tembakau, dan alkohol. Kelola tingkat stres Anda, tidurlah yang cukup (7-8 jam per hari), dan konsultasikan dengan kardiolog untuk verifikasi medis.'
                : 'Pertahankan pola tidur yang teratur, hidrasi tubuh dengan baik, dan kelola stres sehari-hari. Lanjutkan gaya hidup aktif dan lakukan pemeriksaan rutin.'}
            </p>
          </div>
          <p className="text-[9px] italic text-gray-400 mt-3 text-center font-sans">Insight ini bukan pengganti saran medis professional.</p>
        </div>

      </div>

      {/* ==================== BOTTOM ROW ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Edukasi PVC */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-blue-100 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] p-8 flex" data-purpose="pvc-education">
          <div className="flex-1 pr-6">
            <h3 className="text-2xl font-bold text-[#2c5da7] mb-6 font-sans">Edukasi PVC</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-8 font-sans">
              Premature Ventricular Contractions (PVC) adalah denyut jantung ekstra yang mengacaukan ritme normal jantung Anda. Denyut ini dimulai di ruang ventrikel bawah jantung dan terjadi sebelum waktunya. PVC sangat umum terjadi dan bisa dipicu oleh gaya hidup, namun penting untuk dipantau secara klinis.
            </p>
            <button 
              onClick={() => setIsEduOpen(true)}
              className="px-6 py-2 border border-[#4a90e2] text-[#4a90e2] rounded-full text-xs font-bold hover:bg-blue-50 transition-colors font-sans cursor-pointer"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
          <div className="w-40 flex items-center justify-center shrink-0">
            <div className="relative w-48 h-48 shrink-0">
              <Image 
                src="/images/edukasiPVC.png" 
                alt="Edukasi PVC" 
                fill 
                sizes="768px"
                className="object-contain" 
              />
            </div>
          </div>
        </div>

        {/* Gejala Interactive */}
        <div className="lg:col-span-3 bg-[#4a90e2] rounded-3xl shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] p-6 text-white" data-purpose="symptom-tracker">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            </div>
            <h3 className="text-xl font-bold font-sans">Gejala</h3>
          </div>
          <p className="text-[10px] opacity-80 mb-6 font-sans">Gejala yang kamu laporkan:</p>
          <div className="space-y-3">
            
            {/* Berdebar */}
            <div className="bg-white/20 p-2 rounded-2xl flex items-center justify-between border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#4a90e2] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </div>
                <span className="font-bold text-xs">Berdebar?</span>
              </div>
              <select 
                value={isSymptomActive('debar', 'palpitation') ? 'Ya' : 'Tidak'} 
                disabled
                className="bg-white text-[#4a90e2] text-[10px] font-bold rounded-lg border-none py-1 pl-3 pr-8 focus:ring-0 cursor-default appearance-none"
              >
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            {/* Pusing */}
            <div className="bg-white/20 p-2 rounded-2xl flex items-center justify-between border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#4a90e2] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </div>
                <span className="font-bold text-xs">Pusing?</span>
              </div>
              <select 
                value={isSymptomActive('pusing', 'dizziness') ? 'Ya' : 'Tidak'} 
                disabled
                className="bg-white text-[#4a90e2] text-[10px] font-bold rounded-lg border-none py-1 pl-3 pr-8 focus:ring-0 cursor-default appearance-none"
              >
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            {/* Sesak */}
            <div className="bg-white/20 p-2 rounded-2xl flex items-center justify-between border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#4a90e2] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </div>
                <span className="font-bold text-xs">Sesak?</span>
              </div>
              <select 
                value={isSymptomActive('sesak', 'breath') ? 'Ya' : 'Tidak'} 
                disabled
                className="bg-white text-[#4a90e2] text-[10px] font-bold rounded-lg border-none py-1 pl-3 pr-8 focus:ring-0 cursor-default appearance-none"
              >
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

          </div>
        </div>

        {/* Dokter Pasien */}
        <div className="lg:col-span-3 bg-white rounded-3xl border-2 border-blue-100 shadow-[0_10px_25px_-5px_rgba(74,144,226,0.1),0_8px_10px_-6px_rgba(74,144,226,0.1)] p-6" data-purpose="patient-doctors-list">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#2c5da7] font-sans">Dokter Pasien</h3>
            <button className="text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
            </button>
          </div>
          <div className="space-y-4">
            {uniqueDoctors.length === 0 ? (
              <div className="text-center py-10 text-gray-300 text-sm">Belum ada riwayat dokter</div>
            ) : (
              uniqueDoctors.map((doc, idx) => (
                <div key={idx}>
                  {idx > 0 && <hr className="border-gray-100 my-4" />}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative border border-blue-100 bg-slate-100 shrink-0">
                      <Image 
                        src={doc.profile_photo.startsWith('/images') || doc.profile_photo.startsWith('/uploads') ? `http://localhost:8000${doc.profile_photo}` : doc.profile_photo}
                        alt={doc.name} 
                        fill 
                        sizes="40px"
                        className="object-cover" 
                        unoptimized 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 font-sans leading-none">{doc.name}</p>
                      <p className="text-[10px] text-gray-400 font-sans mt-1">{doc.specialization}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ==================== POPUP: DETAIL MODAL ==================== */}
      {isDetailOpen && selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 font-sans">Detail Pemeriksaan ECG</h3>
              <button 
                onClick={() => { setIsDetailOpen(false); setSelectedScan(null); }}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Date and Status */}
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Tanggal Deteksi</p>
                  <p className="font-bold text-slate-800 font-sans">{getFormattedDate(selectedScan.created_at)} {getFormattedTime(selectedScan.created_at)}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full text-white ${
                  selectedScan.verification_status === 'Verified' ? 'bg-[#22c55e]' : 'bg-amber-500'
                }`}>
                  {selectedScan.verification_status || 'Pending'}
                </span>
              </div>

              {/* ECG Image Preview (Larger) */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2 font-sans">Grafik ECG</h4>
                {selectedScan.document_url ? (
                  <div className="relative group overflow-hidden border border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center p-2">
                    <img 
                      src={`http://localhost:8000${selectedScan.document_url}`} 
                      alt="ECG Large Preview" 
                      className="w-full h-64 object-contain rounded-xl"
                    />
                    <a 
                      href={`http://localhost:8000${selectedScan.document_url}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold transition duration-200 gap-2 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Buka di Tab Baru
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex items-center justify-center text-slate-400 text-sm font-sans">
                    Tidak ada gambar ECG
                  </div>
                )}
              </div>

              {/* AI & Verification Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Analysis */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-2 mb-2 font-sans">Hasil Analisis AI</h4>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Status Jantung</span>
                    <span className="font-bold text-slate-800 font-sans">{selectedScan.ai_result || 'Normal Rhythm'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Confidence AI</span>
                    <span className="font-bold text-blue-600 font-sans">{selectedScan.ai_confidence || 90}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Kategori Risiko</span>
                    <span className="font-bold text-amber-600 font-sans">{selectedScan.risk_level || 'Ringan - Sedang'}</span>
                  </div>
                </div>

                {/* Patient Note */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-2 mb-2 font-sans">Catatan Pasien</h4>
                  <p className="text-xs text-slate-600 leading-relaxed italic font-sans">
                    {selectedScan.patient_note || 'Tidak ada catatan tambahan dari pasien.'}
                  </p>
                </div>
              </div>

              {/* Doctor Verification Details */}
              <div className="border border-slate-200/80 rounded-2xl p-5 bg-white space-y-4">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-2 font-sans">Status Verifikasi Dokter</h4>
                {selectedScan.verification_status === 'Verified' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getDoctorImage(selectedScan.doctor?.profile_photo)} 
                        alt={selectedScan.doctor?.name} 
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-sm font-sans">{selectedScan.doctor?.name}</p>
                        <p className="text-xs text-slate-500 font-sans">{selectedScan.doctor?.specialization || 'Spesialis Jantung'}</p>
                      </div>
                    </div>
                    <div className="bg-[#4880FF]/5 border border-[#4880FF]/10 rounded-xl p-4 text-xs text-slate-700">
                      <span className="font-bold text-slate-800 block mb-1 font-sans">Catatan Medis Dokter:</span>
                      <p className="leading-relaxed font-sans">{selectedScan.doctor_note || 'Tidak ada catatan khusus.'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 text-sm font-sans">Menunggu Verifikasi</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-sans">Hasil ECG Anda sedang mengantre untuk diverifikasi oleh dokter {selectedScan.doctor?.name ? `(Dr. ${selectedScan.doctor.name})` : ''}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => { setIsDetailOpen(false); setSelectedScan(null); }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-2xl text-xs transition cursor-pointer font-sans"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== POPUP: EDUKASI PVC MODAL ==================== */}
      {isEduOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 font-sans">Edukasi PVC (Premature Ventricular Contractions)</h3>
              <button 
                onClick={() => setIsEduOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-sm leading-relaxed text-slate-600 font-sans">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-2xl">
                <h4 className="font-bold text-blue-900 mb-1">Apa itu PVC?</h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  PVC adalah denyut jantung ekstra yang diawali dari salah satu ventrikel (bilik bawah) jantung Anda. Denyut prematur ini mengganggu aktivitas listrik ritmis jantung yang normal.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Penyebab & Pemicu Umum</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Kafein & Stimulan:</strong> Konsumsi berlebih kopi, teh, minuman berenergi.</li>
                  <li><strong>Stres & Kecemasan:</strong> Tingkat adrenalin tinggi memicu detak abnormal.</li>
                  <li><strong>Kurang Tidur:</strong> Kelelahan fisik mengganggu sistem syaraf otonom jantung.</li>
                  <li><strong>Ketidakseimbangan Elektrolit:</strong> Kadar kalium atau magnesium rendah dalam darah.</li>
                  <li><strong>Penyakit Jantung:</strong> Riwayat serangan jantung, hipertensi, atau kelainan katup.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Gejala yang Perlu Diperhatikan</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>Sensasi dada terasa berdebar keras (palpitasi).</li>
                  <li>Perasaan seperti jantung "berhenti berdetak" sejenak.</li>
                  <li>Pusing atau kliyengan (dizziness).</li>
                  <li>Sesak napas saat beristirahat atau beraktivitas ringan.</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                <h4 className="font-bold text-red-900 mb-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Kapan Harus Menghubungi Dokter?
                </h4>
                <p className="text-xs text-red-800 leading-relaxed">
                  Jika gejala PVC sering muncul, mengganggu aktivitas sehari-hari, disertai nyeri dada hebat, pingsan, atau jika Anda memiliki riwayat penyakit jantung struktural sebelumnya.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => setIsEduOpen(false)}
                className="bg-[#4880FF] hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer font-sans"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}