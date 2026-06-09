'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  
  // State baru untuk mengontrol buka/tutup dropdown profil
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token) {
          router.push('/login');
          return;
        }

        let currentUser = null;
        if (userStr) {
          currentUser = JSON.parse(userStr);
          setUserData(currentUser);
        }

      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // FUNGSI LOGOUT
  const handleLogout = () => {
    // 1. Hapus data dari memori browser
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Redirect ke halaman login
    router.push('/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Dashboard...</div>;
  }

  const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
  const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* ==================== NAVBAR (Top Bar) ==================== */}
      <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-6 lg:px-10 py-4 flex justify-between items-center shadow-sm">
        
        {/* Kiri: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">PVCare</span>
        </div>

        {/* Tengah: Menu */}
        <div className="hidden md:flex items-center gap-2">
          
          {/* DASHBOARD (Aktif / Biru karena sedang di halaman Dashboard) */}
          <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2 bg-[#4880FF] text-white rounded-full text-sm font-semibold shadow-sm shadow-blue-500/30 transition hover:bg-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </Link>

          {isDoctor ? (
            <>
              {/* PASIEN */}
              <Link href="/pasien" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                Pasien
              </Link>
              {/* VERIFIKASI */}
              <Link href="/verifikasi" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Verifikasi
              </Link>
            </>
          ) : (
            /* DETEKSI PVC (Khusus Pasien) */
            <Link href="/deteksi" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              Deteksi PVC
            </Link>
          )}

          {/* RIWAYAT (Inaktif / Abu-abu karena sedang di halaman Dashboard) */}
          <Link href="/riwayat" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Riwayat
          </Link>

        </div>

        {/* Kanan: Notifikasi & Profil dengan Dropdown */}
        <div className="flex items-center gap-5">
          <button className="relative text-slate-500 hover:text-slate-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[9px] font-bold rounded-full border-2 border-white shadow-sm">5</span>
          </button>
          
          {/* Area Profil & Dropdown */}
          <div className="relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex justify-center items-center cursor-pointer hover:ring-2 hover:ring-blue-100 transition"
            >
              {isDoctor ? (
               <img 
                 // Kita ambil dari doctor_profile atau profile (menyesuaikan format backend)
                 src={userData?.doctor_profile?.profile_photo || userData?.profile?.profile_photo || "https://placehold.co/100x100/transparent/blue?text=Doc"} 
                 alt="Doctor Profile" 
                 className="w-full h-full object-cover" 
               />
            ) : (
               <span className="text-slate-500 font-bold text-sm uppercase">{userData?.profile?.name?.charAt(0) || userData?.name?.charAt(0) || 'U'}</span>
            )}
            </div>

            {/* Menu Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-fade-in-up">
                {/* Opsi Profil */}
                <Link href="/profile" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition">
                  <span className="mr-2">👤</span> Profil Saya
                </Link>
                
                <div className="h-px bg-slate-100 my-1"></div>
                
                {/* Opsi Logout */}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <span className="mr-2">🚪</span> Keluar (Logout)
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== KONTEN DINAMIS (PASIEN / DOKTER) ==================== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isDoctor ? <DokterDashboard userData={userData} /> : <PasienDashboard userData={userData} />}
      </main>

    </div>
  );
}

// ============================================================================
// KOMPONEN: DASHBOARD PASIEN
// ============================================================================
function PasienDashboard({ userData }: { userData: any }) {
  // Mengambil nama dari dalam objek profile (menyesuaikan struktur backend)
  const userName = userData?.profile?.name || userData?.name || 'Pasien';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-semibold text-slate-500">Hi, <span className="text-slate-800 capitalize">{userName}</span> <span className="text-xl">😊</span></h1>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Pemeriksaan Terakhir</h2>
      </div>

      {/* Grid Baris 1: Grafik ECG & Info Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 overflow-hidden relative animate-fade-in-up delay-100">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-blue-700 text-lg">Premature Ventricular Contractions</h3>
             <button className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 transition">Lihat Hasil</button>
           </div>
           <div className="w-full h-40 bg-pink-50/50 border border-pink-100 rounded-lg flex items-center justify-center mb-4">
             <span className="text-pink-300 text-sm">Grafik ECG di sini</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 flex items-center gap-2">
               Status Analisis AI: <strong className="text-slate-800">PVC Ringan Terdeteksi</strong>
             </div>
             <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Verified</span>
           </div>
        </div>

        <div className="lg:col-span-3 bg-[#4880FF] text-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between animate-fade-in-up delay-200">
           <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">🩺</div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-blue-600 px-2 py-1 rounded-full">Catatan Dokter</span>
           </div>
           <div>
             <h4 className="font-bold mb-2">Dr. Aitana Bonmati, Sp.JP, FIHA</h4>
             <p className="text-blue-100 text-xs leading-relaxed line-clamp-4">
               Berdasarkan hasil pemeriksaan terakhir, ritme jantung menunjukkan adanya PVC ringan. Tetap jaga pola makan dan kurangi kafein...
             </p>
           </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 animate-fade-in-up delay-300">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">Riwayat</h3>
             <button className="text-slate-400 hover:text-blue-600 transition">•••</button>
           </div>
           <div className="space-y-4">
             <div className="flex items-center gap-3 border-b border-slate-100 pb-3 cursor-pointer group">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition">📅</div>
               <div>
                 <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition">24 May, 2026</p>
                 <p className="text-[10px] text-slate-500">PVC Ringan Terdeteksi</p>
               </div>
             </div>
             <div className="flex items-center gap-3 cursor-pointer group">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition">📅</div>
               <div>
                 <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition">1 May, 2026</p>
                 <p className="text-[10px] text-slate-500">Normal</p>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Grid Baris 2: Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-fade-in-up delay-100"><StatCard icon="📋" title="Total Pemeriksaan" value="9" sub="Sejak 9 April, 2026" color="blue" /></div>
        <div className="animate-fade-in-up delay-200"><StatCard icon="❤️" title="Rata-rata BPM" value="63" sub="Normal BPM (60-100)" color="red" /></div>
        <div className="animate-fade-in-up delay-300"><StatCard icon="🧠" title="AI Confidence" value="93%" sub="Tingkat akurasi tinggi" color="green" /></div>
        <div className="animate-fade-in-up delay-400"><StatCard icon="🛡️" title="Tingkat Risiko" value="Rendah" sub="Risiko kardiovaskular" color="orange" /></div>
      </div>

      {/* Baris Bawah: Tren & Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 h-64 flex flex-col justify-between animate-fade-in-up delay-300">
           <h3 className="font-bold text-blue-700">Tren PVC Pasien</h3>
           <div className="flex-1 bg-slate-50 mt-4 rounded border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400">Area Grafik Garis (Gunakan library Recharts nanti)</div>
         </div>
         
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 animate-fade-in-up delay-400">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-full">💡</div>
             <h3 className="font-bold text-blue-700">Insight AI</h3>
           </div>
           <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
             <p className="text-xs text-slate-600 leading-relaxed mb-3">Ritme ektopik terdeteksi sesekali, namun tidak ada pola aritmia berbahaya berlanjut.</p>
             <p className="text-xs font-bold text-slate-800">Rekomendasi:</p>
             <p className="text-xs text-blue-700 font-medium mt-1">Istirahat yang cukup dan hindari stres. Segera hubungi dokter jika dada terasa nyeri hebat.</p>
           </div>
         </div>
      </div>
    </div>
  );
}

// ============================================================================
// KOMPONEN: DASHBOARD DOKTER
// ============================================================================
function DokterDashboard({ userData }: { userData: any }) {
  // Mengambil nama dari dalam objek profile untuk dokter
  const doctorName = userData?.profile?.name || userData?.name || 'Dokter';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-slate-900">Dashboard Anda</h2>
        <p className="text-slate-500 mt-1 text-base">Selamat datang, <strong className="text-blue-600 capitalize">Dr. {doctorName}</strong>. Berikut ringkasan aktivitas Anda 😊</p>
      </div>

      {/* Grid Baris 1: Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-fade-in-up delay-100"><StatCard icon="👥" title="Total Pasien" value="521" sub="" color="blue" /></div>
        <div className="animate-fade-in-up delay-200"><StatCard icon="✓" title="Pasien Diverifikasi" value="518" sub="" color="green" /></div>
        <div className="animate-fade-in-up delay-300"><StatCard icon="⏱" title="Menunggu Diverifikasi" value="3" sub="" color="purple" /></div>
        <div className="animate-fade-in-up delay-400"><StatCard icon="⭐" title="Rating Anda" value="4.9" sub="" color="orange" /></div>
      </div>

      {/* Grid Baris 2: Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 h-72 flex flex-col justify-between animate-fade-in-up delay-300">
           <h3 className="font-bold text-slate-800">Verifikasi Mingguan</h3>
           <div className="flex-1 bg-slate-50 mt-4 rounded border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400">Grafik Batang (Bar Chart)</div>
         </div>
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 h-72 flex flex-col justify-between animate-fade-in-up delay-400">
           <h3 className="font-bold text-slate-800">Tren Pasien Bulanan</h3>
           <div className="flex-1 bg-slate-50 mt-4 rounded border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400">Grafik Garis (Line Chart)</div>
         </div>
      </div>

      {/* Sisa Grid: Pending Verifications & Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in-up delay-300">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">Pending Verifications</h3>
             <button className="text-xs text-blue-600 font-bold hover:underline transition">Lihat Semua →</button>
           </div>
           <div className="space-y-3">
             {[
               { init: 'AH', name: 'Ahmad Hidayat', age: '45 tahun', date: '15 Mei 2026', conf: '98%', color: 'text-red-500', bg: 'bg-red-50' },
               { init: 'SN', name: 'Siti Nurhaliza', age: '52 tahun', date: '14 Mei 2026', conf: '96%', color: 'text-orange-500', bg: 'bg-orange-50' },
               { init: 'BS', name: 'Budi Santoso', age: '38 tahun', date: '14 Mei 2026', conf: '94%', color: 'text-green-500', bg: 'bg-green-50' },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-blue-100 hover:shadow-sm transition-all cursor-pointer group">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">{item.init}</div>
                   <div>
                     <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">{item.name}</p>
                     <p className="text-[10px] text-slate-500">{item.age} • Uploaded: {item.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] text-slate-400 font-medium">AI Confidence</p>
                   <p className="text-blue-600 font-extrabold text-lg leading-none mt-1">{item.conf}</p>
                   <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full mt-1 inline-block ${item.color} ${item.bg}`}>Status</span>
                 </div>
               </div>
             ))}
           </div>
         </div>
         
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in-up delay-400">
           <h3 className="font-bold text-slate-800 mb-4">Aktivitas Terbaru</h3>
           <div className="space-y-5">
              <div className="flex gap-3 relative before:absolute before:left-4 before:top-8 before:w-0.5 before:h-8 before:bg-slate-100">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0 z-10">📈</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Verified PVC analysis</p>
                  <p className="text-xs text-slate-500 mt-1">Ahmad Hidayat</p>
                  <p className="text-[10px] text-slate-400 mt-1">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex gap-3 relative before:absolute before:left-4 before:top-8 before:w-0.5 before:h-8 before:bg-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center text-xs shrink-0 z-10">👁️</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Reviewed ECG data</p>
                  <p className="text-xs text-slate-500 mt-1">Siti Nurhaliza</p>
                  <p className="text-[10px] text-slate-400 mt-1">4 jam yang lalu</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center text-xs shrink-0 z-10">📝</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Added medical notes</p>
                  <p className="text-xs text-slate-500 mt-1">Budi Santoso</p>
                  <p className="text-[10px] text-slate-400 mt-1">6 jam yang lalu</p>
                </div>
              </div>
           </div>
         </div>
      </div>
    </div>
  );
}

// ============================================================================
// KOMPONEN PENDUKUNG: KARTU STATISTIK
// ============================================================================
function StatCard({ icon, title, value, sub, color }: any) {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    red: 'text-red-500 bg-red-50 border-red-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    orange: 'text-orange-500 bg-orange-50 border-orange-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 flex items-center gap-4 cursor-default">
      <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-2xl border-[3px] border-white shadow-sm ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{title}</p>
        <p className={`text-2xl font-black mt-0.5 tracking-tight ${colorMap[color].split(' ')[0]}`}>{value}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}