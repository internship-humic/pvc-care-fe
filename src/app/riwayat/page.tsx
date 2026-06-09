'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- DATA DUMMY RIWAYAT DOKTER ---
const RIWAYAT_DOKTER = [
  { id: 1, name: "Ahmad Hidayat", status: "Verified", date: "15 Mei 2026 • 14:30", confidence: "98%", note: "Hasil analisis AI akurat. PVC yang terdeteksi masih dalam kategori ringan." },
  { id: 2, name: "Siti Nurhaliza", status: "Verified", date: "14 Mei 2026 • 10:15", confidence: "96%", note: "PVC frekuensi sedang terdeteksi. Pasien disarankan monitoring rutin." },
  { id: 3, name: "Budi Santoso", status: "Verified", date: "12 Mei 2026 • 16:45", confidence: "94%", note: "Kondisi stabil. Tidak ada tindakan medis khusus diperlukan." },
  { id: 4, name: "Dewi Lestari", status: "Verified", date: "10 Mei 2026 • 09:20", confidence: "97%", note: "PVC konsisten dengan analisis AI. Lanjutkan pola hidup sehat." },
];

export default function RiwayatPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
    } else {
      setUserData(JSON.parse(userStr));
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memuat Riwayat...</div>;
  }

  const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
  const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');
  const userInitials = userData?.profile?.name?.charAt(0) || userData?.name?.charAt(0) || 'U';
  const profilePhoto = userData?.doctor_profile?.profile_photo || userData?.profile?.profile_photo;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      
      {/* ==================== NAVBAR ==================== */}
      <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-6 lg:px-10 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">PVCare</span>
        </div>

        {/* MENU TENGAH (Sudah Diperbaiki untuk Dokter & Pasien) */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
             Dashboard
          </Link>

          {isDoctor ? (
            <>
              <Link href="#" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                Pasien
              </Link>
              <Link href="#" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Verifikasi
              </Link>
            </>
          ) : (
            <Link href="/deteksi" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              Deteksi PVC
            </Link>
          )}

          <Link href="/riwayat" className="flex items-center gap-2 px-5 py-2 bg-[#4880FF] text-white rounded-full text-sm font-semibold shadow-sm shadow-blue-500/30 transition hover:bg-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Riwayat
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <button className="relative text-slate-500 hover:text-slate-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[9px] font-bold rounded-full border-2 border-white shadow-sm">5</span>
          </button>
          
          <div className="relative">
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex justify-center items-center cursor-pointer hover:ring-2 hover:ring-blue-100 transition">
              {profilePhoto ? (
                 <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                 <span className="text-slate-500 font-bold text-sm uppercase">{userInitials}</span>
              )}
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-fade-in-up">
                <Link href="/profile" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"><span className="mr-2">👤</span> Profil Saya</Link>
                <div className="h-px bg-slate-100 my-1"></div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"><span className="mr-2">🚪</span> Keluar</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== KONTEN UTAMA ==================== */}
      <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in-up">
        {isDoctor ? <DoctorRiwayat /> : <PatientRiwayat />}
      </main>

    </div>
  );
}

// ============================================================================
// KOMPONEN: RIWAYAT DOKTER
// ============================================================================
function DoctorRiwayat() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Riwayat Verifikasi</h1>
        <p className="text-slate-500 text-lg mt-1">Lihat semua verifikasi PVC yang telah Anda selesaikan</p>
      </div>

      {/* KARTU STATISTIK (4 Kolom) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="bg-white border-2 border-blue-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-blue-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl border border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Total Verifikasi</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">521</p>
          </div>
        </div>

        <div className="bg-white border-2 border-green-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-green-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-2xl border border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Approved</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">518</p>
          </div>
        </div>

        <div className="bg-white border-2 border-purple-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-purple-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-2xl border border-purple-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Minggu Ini</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">21</p>
          </div>
        </div>

        <div className="bg-white border-2 border-cyan-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-cyan-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center text-2xl border border-cyan-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Avg. Confidence</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">98%</p>
          </div>
        </div>

      </div>

      {/* DAFTAR RIWAYAT */}
      <div className="bg-white rounded-3xl shadow-sm border-[1.5px] border-blue-400/50 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Verification History</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {RIWAYAT_DOKTER.map((item) => (
            <div key={item.id} className="p-8 hover:bg-slate-50/50 transition">
              <div className="flex items-start gap-4">
                
                {/* Ikon Check Hijau */}
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-xl shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                        <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-full">{item.status}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {item.date}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                      AI Confidence: <strong className="text-blue-500 ml-1">{item.confidence}</strong>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] rounded-xl p-4 text-sm text-slate-700">
                    <strong>Catatan:</strong> {item.note}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// KOMPONEN: RIWAYAT PASIEN (Placeholder untuk nanti)
// ============================================================================
function PatientRiwayat() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-slate-800">Riwayat Pasien</h2>
      <p className="text-slate-500 mt-2">Halaman riwayat untuk pasien akan segera dibuat.</p>
    </div>
  );
}