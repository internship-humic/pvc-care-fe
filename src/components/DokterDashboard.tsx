'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatCard from './StatCard';

const getRelativeTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays === 1) return 'Kemarin';
    return `${diffDays} hari yang lalu`;
  } catch {
    return '';
  }
};

const getConfidenceBadge = (confidence: number) => {
  if (confidence >= 90) {
    return (
      <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 inline-block text-green-600 bg-green-50">
        High
      </span>
    );
  } else if (confidence >= 75) {
    return (
      <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 inline-block text-amber-600 bg-amber-50">
        Medium
      </span>
    );
  } else {
    return (
      <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 inline-block text-red-600 bg-red-50">
        Low
      </span>
    );
  }
};

export default function DokterDashboard({ userData }: { userData: any }) {
  const router = useRouter();
  const doctorName = userData?.doctor_profile?.name || userData?.profile?.name || userData?.name || 'Dokter';
  const verificationStatus = userData?.doctor_profile?.verification_status || userData?.profile?.verification_status || 'Pending';
  const isVerified = verificationStatus === 'Verified';

  const [summary, setSummary] = useState<any>(null);
  const [pendingScans, setPendingScans] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [sumRes, histRes] = await Promise.all([
          fetch('http://localhost:8000/api/pvc-scans/dashboard/summary', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:8000/api/pvc-scans/history', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (sumRes.ok) {
          const data = await sumRes.json();
          setSummary(data.data);
        }
        
        if (histRes.ok) {
          const data = await histRes.json();
          const scans = data.data?.data || [];
          
          // Filter out the ones that are pending
          const pending = scans.filter((s: any) => s.verification_status === "Pending");
          setPendingScans(pending.slice(0, 3)); // show top 3

          // Filter out verified scans for recent activities
          const verified = scans.filter((s: any) => s.verification_status === "Verified");
          setRecentActivities(verified.slice(0, 3)); // show top 3
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboardData();
  }, []);
  
  return (
    <div className="space-y-6">
      {!isVerified && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md shadow-sm animate-fade-in-up flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <p className="font-medium text-sm">Akun Anda sedang dalam proses verifikasi oleh Admin. Beberapa fitur utama mungkin belum dapat digunakan.</p>
        </div>
      )}

      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-slate-900">Dashboard Anda</h2>
        <p className="text-slate-500 mt-1 text-base">Selamat datang, <strong className="text-blue-600 capitalize">Dr. {doctorName}</strong>. Berikut ringkasan aktivitas Anda 😊</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-fade-in-up delay-100"><StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} title="Total Pasien" value={summary?.total_verifications || 0} sub="" color="blue" /></div>
        <div className="animate-fade-in-up delay-200"><StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Pasien Diverifikasi" value={summary?.verified_count || 0} sub="" color="green" /></div>
        <div className="animate-fade-in-up delay-300"><StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Menunggu Diverifikasi" value={summary?.pending_count || 0} sub="" color="purple" /></div>
        <div className="animate-fade-in-up delay-400"><StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} title="Rating Anda" value="4.9" sub="" color="orange" /></div>
      </div>

      {/* ==================== BARIS 2: GRAFIK & TREN ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-150">
        
        {/* Card: Verifikasi Mingguan */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Verifikasi Mingguan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Jumlah scan yang diverifikasi minggu ini</p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">7 Hari Terakhir</span>
            </div>
            
            {/* Bar Chart Container */}
            <div className="h-48 flex items-end justify-between px-2 pt-4 border-b border-slate-100 relative">
              {/* Background Gridlines */}
              <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-slate-100"></div>
              <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-slate-100"></div>
              <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-slate-100"></div>
              
              {/* Bars */}
              {[
                { day: 'Sen', val: 12, h: 'h-[48%]' },
                { day: 'Sel', val: 19, h: 'h-[76%]' },
                { day: 'Rab', val: 8, h: 'h-[32%]' },
                { day: 'Kam', val: 15, h: 'h-[60%]' },
                { day: 'Jum', val: 22, h: 'h-[88%]' },
                { day: 'Sab', val: 6, h: 'h-[24%]' },
                { day: 'Min', val: 4, h: 'h-[16%]' }
              ].map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group z-10">
                  <div className="relative w-full flex justify-center">
                    {/* Tooltip on hover */}
                    <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      {bar.val}
                    </span>
                    {/* The Bar */}
                    <div className={`w-8 ${bar.h} bg-gradient-to-t from-blue-500 to-[#4a90e2] rounded-t-lg group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300 shadow-sm shadow-blue-200`}></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold mt-2">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card: Tren Pasien Bulanan */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Tren Pasien Bulanan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pertumbuhan pasien terdaftar</p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">6 Bulan Terakhir</span>
            </div>

            {/* Line Chart via SVG */}
            <div className="h-48 relative pt-4">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#4a90e2" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Gridlines */}
                <line x1="0" y1="37.5" x2="400" y2="37.5" stroke="#F1F5F9" strokeDasharray="3,3"/>
                <line x1="0" y1="75" x2="400" y2="75" stroke="#F1F5F9" strokeDasharray="3,3"/>
                <line x1="0" y1="112.5" x2="400" y2="112.5" stroke="#F1F5F9" strokeDasharray="3,3"/>
                
                {/* Area under line */}
                <path 
                  d="M 10 130 C 70 120, 130 90, 190 70 C 250 50, 310 110, 390 30 L 390 150 L 10 150 Z" 
                  fill="url(#gradient-area)"
                />
                {/* Main Line path */}
                <path 
                  d="M 10 130 C 70 120, 130 90, 190 70 C 250 50, 310 110, 390 30" 
                  fill="none" 
                  stroke="#4a90e2" 
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Interactive circles/nodes */}
                <circle cx="10" cy="130" r="4" fill="#ffffff" stroke="#4a90e2" strokeWidth="2"/>
                <circle cx="90" cy="110" r="4" fill="#ffffff" stroke="#4a90e2" strokeWidth="2"/>
                <circle cx="170" cy="77" r="4" fill="#ffffff" stroke="#4a90e2" strokeWidth="2"/>
                <circle cx="250" cy="50" r="4" fill="#ffffff" stroke="#4a90e2" strokeWidth="2"/>
                <circle cx="330" cy="85" r="4" fill="#ffffff" stroke="#4a90e2" strokeWidth="2"/>
                <circle cx="390" cy="30" r="4" fill="#ffffff" stroke="#4a90e2" strokeWidth="2"/>
              </svg>
              {/* Y Axis labels overlay */}
              <div className="absolute left-0 top-4 text-[8px] font-bold text-slate-400 flex flex-col justify-between h-[80%]">
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>
              
              {/* X Axis Month Labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2 px-1">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>Mei</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ==================== BARIS 3: ANTREAN & AKTIVITAS ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kiri (Span 2): Pending Verifications */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in-up delay-300">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Pending Verifications</h3>
              <p className="text-xs text-slate-500 mt-0.5">Scan PVC yang menunggu keputusan Anda</p>
            </div>
            {isVerified ? (
              <Link href="/verifikasi" className="text-xs text-blue-600 font-bold hover:underline transition">Lihat Semua →</Link>
            ) : (
              <span className="text-xs text-slate-400 font-bold cursor-not-allowed" title="Fitur ini terkunci">Lihat Semua 🔒</span>
            )}
          </div>
          
          <div className="space-y-3">
            {pendingScans.length === 0 && (
              <div className="text-sm text-slate-500 py-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                Tidak ada scan yang pending.
              </div>
            )}
            {pendingScans.map((item, i) => (
              <div 
                key={i} 
                onClick={() => {
                  if (isVerified) {
                    router.push('/verifikasi');
                  }
                }}
                className={`flex items-center justify-between p-4 border border-slate-100 rounded-xl transition-all group ${
                  isVerified ? 'hover:bg-slate-50/80 cursor-pointer hover:border-blue-100 hover:shadow-sm' : 'opacity-60 cursor-not-allowed bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center transition-all ${
                    isVerified ? 'group-hover:bg-blue-600 group-hover:text-white' : ''
                  }`}>
                    {(item.patient?.name || "P")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-bold text-slate-800 text-sm transition-all ${isVerified ? 'group-hover:text-blue-600' : ''}`}>
                      {item.patient?.name || "Pasien"}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Diunggah: {new Date(item.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">AI Confidence</p>
                    <p className="text-blue-600 font-extrabold text-lg leading-none mt-1">{item.ai_confidence}%</p>
                    {getConfidenceBadge(item.ai_confidence)}
                  </div>
                  {!isVerified && <span className="text-slate-300 text-xl" title="Terkunci">🔒</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanan (Span 1): Aktivitas Terbaru */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in-up delay-400">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-base">Aktivitas Terbaru</h3>
            <p className="text-xs text-slate-500 mt-0.5">Aktivitas verifikasi rekam medis terakhir</p>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length === 0 && (
              <div className="text-sm text-slate-500 py-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                Belum ada riwayat aktivitas.
              </div>
            )}
            {recentActivities.map((item, i) => {
              const hasNotes = !!item.doctor_note;
              const timeDisplay = getRelativeTime(item.updated_at || item.created_at);
              return (
                <div key={i} className="flex gap-3 items-start border-l-2 border-blue-100 pl-4 py-1 relative animate-fade-in-up">
                  {/* Circle marker on border */}
                  <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-blue-500"></div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{item.patient?.name || "Pasien"}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {hasNotes ? "Verified PVC analysis & Added medical notes" : "Verified PVC analysis"}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium inline-block mt-1">
                      🕒 {timeDisplay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}