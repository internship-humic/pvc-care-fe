'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar({ userData }: { userData: any }) {
  const router = useRouter();
  const pathname = usePathname(); // Mendeteksi URL saat ini
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // --- DETEKSI ROLE ---
  const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
  const isAdmin = roleValue === 'admin';
  const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');
  const isPatient = !isAdmin && !isDoctor;

  const userInitials = isAdmin ? 'A' : (userData?.profile?.name?.charAt(0) || userData?.name?.charAt(0) || 'U');
  const profilePhoto = userData?.doctor_profile?.profile_photo || userData?.profile?.profile_photo;

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAdmin) return;
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:8000/api/notifications/unread-count', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.data?.unread_count ?? 0);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  // --- FUNGSI STYLING MENU AKTIF ---
  // Jika pathname sama dengan path menu, jadikan biru. Jika tidak, jadikan abu-abu.
  const getMenuClass = (path: string) => {
    return pathname === path
      ? "flex items-center gap-2 px-5 py-2 bg-[#4880FF] text-white rounded-full text-sm font-semibold shadow-sm shadow-blue-500/30 transition hover:bg-blue-600"
      : "flex items-center gap-2 px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition";
  };

  return (
    <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-6 lg:px-10 py-4 flex justify-between items-center shadow-sm">
      
      {/* KIRI: LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10  rounded-full flex items-center justify-center">
          <img src="/LogoPVC.png" alt="PVCare Logo" className="w-full h-full object-cover" />
        </div>
        <span className="font-extrabold text-xl text-slate-800 tracking-tight">
          PVCare {isAdmin && <span className="text-red-500 text-xs uppercase bg-red-50 px-2 py-0.5 rounded-full ml-1 align-middle">Admin</span>}
        </span>
      </div>

      {/* TENGAH: MENU DINAMIS SESUAI ROLE */}
      <div className="hidden md:flex items-center gap-2">
        <Link href="/dashboard" className={getMenuClass('/dashboard')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Dashboard
        </Link>

        {isAdmin && (
          <>
            <Link href="/kelola-dokter" className={getMenuClass('/kelola-dokter')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Kelola Dokter
            </Link>
            <Link href="/kelola-pasien" className={getMenuClass('/kelola-pasien')}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Kelola Pasien
            </Link>
          </>
        )}

        {isDoctor && (
          <>
            <Link href="/pasien" className={getMenuClass('/pasien')}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Pasien
            </Link>
            <Link href="/verifikasi" className={getMenuClass('/verifikasi')}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Verifikasi
            </Link>
          </>
        )}

        {isPatient && (
          <Link href="/deteksi" className={getMenuClass('/deteksi')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            Deteksi PVC
          </Link>
        )}

        {(isDoctor || isPatient) && (
          <Link href="/riwayat" className={getMenuClass('/riwayat')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Riwayat
          </Link>
        )}
      </div>

      {/* KANAN: PROFIL & NOTIFIKASI */}
      <div className="flex items-center gap-5">
        {!isAdmin && (
          <Link href="/notifikasi" className="relative text-slate-500 hover:text-slate-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[9px] font-bold rounded-full border-2 border-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </Link>
        )}
        
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-9 h-9 rounded-full border border-slate-200 overflow-hidden flex justify-center items-center cursor-pointer hover:ring-2 transition ${isAdmin ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
          >
            {profilePhoto ? (
               <img src={`http://localhost:8000${profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
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
  );
}