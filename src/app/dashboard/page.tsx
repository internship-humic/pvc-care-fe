'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import komponen yang sudah dipisah
import AdminDashboard from '../../components/AdminDashboard';
import DokterDashboard from '../../components/DokterDashboard';
import PasienDashboard from '../../components/PasienDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
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

        if (userStr) {
          setUserData(JSON.parse(userStr));
        }

      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Dashboard...</div>;
  }

  // --- DETEKSI 3 ROLE BERBEDA ---
  const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
  const isAdmin = roleValue === 'admin';
  const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');
  const isPatient = !isAdmin && !isDoctor;

  const userInitials = isAdmin ? 'A' : (userData?.profile?.name?.charAt(0) || userData?.name?.charAt(0) || 'U');
  const profilePhoto = userData?.doctor_profile?.profile_photo || userData?.profile?.profile_photo;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* ==================== NAVBAR ==================== */}
      <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-6 lg:px-10 py-4 flex justify-between items-center shadow-sm">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden shadow-sm shadow-blue-200">
            <img src="/LogoPVC.png" alt="PVCare Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">PVCare {isAdmin && <span className="text-red-500 text-xs uppercase bg-red-50 px-2 py-0.5 rounded-full ml-1 align-middle">Admin</span>}</span>
        </div>

        {/* MENU TENGAH DINAMIS SESUAI ROLE */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2 bg-[#4880FF] text-white rounded-full text-sm font-semibold shadow-sm transition hover:bg-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </Link>

          {isAdmin && (
            <>
              <Link href="/dashboard/dokter" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">👥 Kelola Dokter</Link>
              <Link href="/dashboard/pasien" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">🏥 Kelola Pasien</Link>
            </>
          )}

          {isDoctor && (
            <>
              <Link href="/pasien" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">👥 Pasien</Link>
              <Link href="/verifikasi" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">✓ Verifikasi</Link>
            </>
          )}

          {isPatient && (
            <Link href="/deteksi" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">∿ Deteksi PVC</Link>
          )}

          {(isDoctor || isPatient) && (
            <Link href="/riwayat" className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition">⏱ Riwayat</Link>
          )}
        </div>

        {/* PROFIL KANAN */}
        <div className="flex items-center gap-5">
          {!isAdmin && (
            <button className="relative text-slate-500 hover:text-slate-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[9px] font-bold rounded-full border-2 border-white shadow-sm">5</span>
            </button>
          )}
          
          <div className="relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-9 h-9 rounded-full border border-slate-200 overflow-hidden flex justify-center items-center cursor-pointer hover:ring-2 transition ${isAdmin ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
            >
              {profilePhoto ? (
                 <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                 <span className="font-bold text-sm uppercase">{userInitials}</span>
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-fade-in-up">
                {!isAdmin && (
                  <>
                    <Link href="/profile" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"><span className="mr-2">👤</span> Profil Saya</Link>
                    <div className="h-px bg-slate-100 my-1"></div>
                  </>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"><span className="mr-2">🚪</span> Keluar</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== KONTEN DINAMIS (MEMANGGIL KOMPONEN) ==================== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isAdmin && <AdminDashboard />}
        {isDoctor && <DokterDashboard userData={userData} />}
        {isPatient && <PasienDashboard userData={userData} />}
      </main>

    </div>
  );
}