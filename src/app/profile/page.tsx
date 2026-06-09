'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
    } else {
      setUserData(JSON.parse(userStr));
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memuat Profil...</div>;
  }

  const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
  const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      
      {/* ==================== HEADER SIMPLE ==================== */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 lg:px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">PVCare</span>
        </div>

        <Link href="/dashboard" className="border border-slate-300 hover:border-blue-500 text-blue-600 text-xs font-bold py-2 px-5 rounded-full transition-all shadow-sm">
          Kembali ke dashboard
        </Link>
      </nav>

      {/* ==================== KONTEN UTAMA ==================== */}
      <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in-up">
        {isDoctor ? <DoctorProfile userData={userData} /> : <PatientProfile userData={userData} />}
      </main>

    </div>
  );
}

// ============================================================================
// KOMPONEN: PROFIL PASIEN
// ============================================================================
function PatientProfile({ userData }: { userData: any }) {
  // Ambil data profil, sesuaikan dengan struktur backend
  const profile = userData?.profile || userData?.patient_profile || {};
  const email = userData?.email || 'email@example.com';
  const name = profile.name || userData?.name || 'Pasien';
  const phone = profile.phone || '-';
  const gender = profile.gender === 'Male' ? 'Laki-laki' : profile.gender === 'Female' ? 'Perempuan' : profile.gender || '-';
  
  // Format Tanggal
  let birthDate = '-';
  if (profile.birthdate) {
    const d = new Date(profile.birthdate);
    birthDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Ambil inisial nama untuk avatar
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Profile Pasien</h1>
        <p className="text-slate-500 text-lg mt-1">Kelola informasi pribadi dan pengaturan akun Anda</p>
      </div>

      {/* KARTU INFORMASI PRIBADI */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-6">
        
        {/* Header Kartu (Avatar & Tombol Edit) */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-[#4880FF] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-blue-500/30">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{name}</h2>
              <p className="text-slate-500">{email}</p>
            </div>
          </div>
          <button className="bg-[#4880FF] hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Profile
          </button>
        </div>

        <hr className="border-slate-100 mb-8" />

        {/* Form Informasi Biasa (Read-Only) */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
              <span className="text-slate-400 mr-3">👤</span>
              <span className="text-slate-800 font-medium">{name}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Email</label>
            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
              <span className="text-slate-400 mr-3">✉️</span>
              <span className="text-slate-800 font-medium">{email}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Nomor HP</label>
            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
              <span className="text-slate-400 mr-3">📞</span>
              <span className="text-slate-800 font-medium">{phone}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Jenis Kelamin</label>
              <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
                <span className="text-slate-800 font-medium">{gender}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Tanggal Lahir</label>
              <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
                <span className="text-slate-400 mr-3">📅</span>
                <span className="text-slate-800 font-medium">{birthDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KARTU KEAMANAN */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-5">Keamanan</h3>
        <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-slate-500 text-xl">
              🔒
            </div>
            <div>
              <p className="font-bold text-slate-800">Password</p>
              <p className="text-xs text-slate-500 mt-0.5">Terakhir diubah 3 bulan yang lalu</p>
            </div>
          </div>
          <button className="border border-slate-300 hover:border-slate-400 text-slate-700 font-bold py-2 px-5 rounded-xl text-sm bg-white shadow-sm transition-all">
            Ubah Password
          </button>
        </div>
      </div>

    </div>
  );
}

// ============================================================================
// KOMPONEN: PROFIL DOKTER
// ============================================================================
function DoctorProfile({ userData }: { userData: any }) {
  const profile = userData?.profile || userData?.doctor_profile || {};
  const email = userData?.email || 'email@example.com';
  const name = profile.name || userData?.name || 'Dokter';
  const phone = profile.phone || '-';
  const gender = profile.gender === 'Male' ? 'Laki-laki' : profile.gender === 'Female' ? 'Perempuan' : profile.gender || '-';
  const profilePhoto = profile.profile_photo || 'https://placehold.co/400x500/e2e8f0/64748b?text=Doctor+Photo';

  // Dummy stat
  const statPasien = "08213453456"; // Di desain angkanya mirip no telepon, kita ikuti desain
  const statVerifikasi = "1111";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Profile Dokter</h1>
        <p className="text-slate-500 text-lg mt-1">Informasi profesional dan statistik verifikasi Anda</p>
      </div>

      {/* CONTAINER ABU-ABU (Sesuai Desain Figma) */}
      <div className="bg-[#F1F5F9] rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* KIRI: KARTU UTAMA DOKTER */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm p-6 relative">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Foto Dokter */}
            <div className="w-full md:w-1/2 relative group">
              <img src={profilePhoto} alt="Doctor" className="w-full h-auto aspect-[3/4] object-cover rounded-3xl border border-slate-100 shadow-sm" />
              <button className="absolute top-4 right-4 text-xs font-bold text-slate-500 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm hover:text-blue-600 transition">
                Edit
              </button>
            </div>

            {/* Info Dokter */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              
              <div className="border-b border-slate-200 pb-3 mb-4">
                <p className="text-sm font-medium text-slate-500">Nama Anda</p>
                <h2 className="text-2xl font-black text-slate-800 leading-tight mt-1">{name}</h2>
              </div>

              <div className="border-b border-slate-200 pb-3 mb-4">
                <p className="text-sm font-medium text-slate-500">Specialist</p>
                <h3 className="text-xl font-bold text-slate-800 mt-1">Cardiology</h3>
              </div>

              <div className="border-b border-slate-200 pb-3 mb-4">
                <p className="text-sm font-medium text-slate-500">Status</p>
                <h3 className="text-xl font-bold text-slate-800 mt-1">Terverifikasi</h3>
              </div>

              <div className="pb-3 mb-2">
                <p className="text-sm font-medium text-slate-500">Jenis Kelamin</p>
                <h3 className="text-xl font-bold text-slate-800 mt-1">{gender}</h3>
              </div>

            </div>
          </div>

          {/* Kontak Baris Bawah */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4">
            <div className="flex-1 flex items-center gap-3 border-[1.5px] border-blue-400 rounded-2xl p-4 shadow-sm shadow-blue-100">
              <div className="w-12 h-12 rounded-full border border-blue-200 bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
                ✉️
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-slate-500 font-medium">email</p>
                <p className="font-bold text-slate-800 text-sm truncate">{email}</p>
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 border-[1.5px] border-blue-400 rounded-2xl p-4 shadow-sm shadow-blue-100">
              <div className="w-12 h-12 rounded-full border border-blue-200 bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
                📞
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-slate-500 font-medium">Nomor Telepon</p>
                <p className="font-bold text-slate-800 text-sm truncate">{phone}</p>
              </div>
            </div>
          </div>

        </div>

        {/* KANAN: STATISTIK (Pill Cards) */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          
          <div className="bg-[#D1E0F5] border border-blue-200 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-blue-300">
              👥
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Total Pasien</p>
              <p className="text-lg font-black text-slate-800 leading-none mt-1">{statPasien}</p>
            </div>
          </div>

          <div className="bg-[#D4EEDC] border border-green-200 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-green-300">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Verifikasi Selesai</p>
              <p className="text-xl font-black text-slate-800 leading-none mt-1">{statVerifikasi}</p>
            </div>
          </div>

          <div className="bg-[#FBEED1] border border-orange-200 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-orange-400 text-white rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-orange-200">
              ⭐
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Rating</p>
              <p className="text-2xl font-black text-slate-800 leading-none mt-1">4.9</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}