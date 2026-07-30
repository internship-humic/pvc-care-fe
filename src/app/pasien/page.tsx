'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const getAge = (birthdate: string) => {
  if (!birthdate) return 0;
  const birth = new Date(birthdate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const formatLastVisit = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

export default function PasienPage() {
  const router = useRouter();
  const { userData, loading: authLoading, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Fitur Search & Patients
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!userData) {
      router.push('/login');
      return;
    }

    // Keamanan Ekstra: Jika bukan dokter, tendang ke dashboard pasien
    const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
    const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');
    if (!isDoctor) {
      router.push('/dashboard');
      return;
    }
    
    setIsLoading(false);
  }, [router, userData, authLoading]);

  useEffect(() => {
    if (isLoading) return;

    const fetchPatients = async () => {
      setLoadingPatients(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8000/api/doctor-profile/me/patients?search=${encodeURIComponent(searchQuery)}&limit=100`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setPatients(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setLoadingPatients(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, isLoading, token]);

  if (authLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">Memuat data...</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      
      {/* ==================== NAVBAR ==================== */}
      <Navbar userData={userData} />

      {/* ==================== KONTEN UTAMA ==================== */}
      <main className="max-w-[1400px] mx-auto px-6 py-10 animate-fade-in-up">
        
        {/* HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Daftar Pasien</h1>
            <p className="text-slate-500 text-lg mt-1">Kelola dan lihat informasi semua pasien Anda</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari pasien..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* TABEL DATA PASIEN */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Table Header (Grid Layout) */}
          <div className="grid grid-cols-12 gap-4 items-center px-8 py-4 bg-slate-50/80 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
            <div className="col-span-4">Pasien</div>
            <div className="col-span-3">Kontak</div>
            <div className="col-span-2">Last Visit</div>
            <div className="col-span-1 text-center">Total Tests</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right"></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {loadingPatients ? (
              <div className="py-12 flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4880FF]"></div>
                <span className="ml-3 text-slate-500 font-medium text-sm mt-2">Memuat data pasien...</span>
              </div>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
                <div key={patient.id} className="grid grid-cols-12 gap-4 items-center px-8 py-4 hover:bg-slate-50/50 transition-colors duration-200">
                  
                  {/* Kolom 1: Avatar & Nama */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4880FF] text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20 shrink-0">
                      {getInitials(patient.name)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-800 truncate">{patient.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{getAge(patient.birthdate)} tahun · {patient.gender === 'Male' ? 'Laki-laki' : patient.gender === 'Female' ? 'Perempuan' : patient.gender}</p>
                    </div>
                  </div>

                  {/* Kolom 2: Kontak */}
                  <div className="col-span-3 overflow-hidden">
                    <p className="text-sm font-medium text-slate-700 truncate">{patient.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{patient.phone}</p>
                  </div>

                  {/* Kolom 3: Last Visit */}
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-slate-700">{formatLastVisit(patient.last_visit)}</p>
                  </div>

                  {/* Kolom 4: Total Tests */}
                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-slate-800">{patient.total_scans}</p>
                  </div>

                  {/* Kolom 5: Status Badge */}
                  <div className="col-span-1">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      patient.latest_status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'
                    }`}>
                      {patient.latest_status || 'Pending'}
                    </span>
                  </div>

                  {/* Kolom 6: Action Button */}
                  <div className="col-span-1 text-right flex justify-end">
                    <Link href="/riwayat" className="flex items-center gap-1.5 text-[#4880FF] hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View
                    </Link>
                  </div>

                </div>
              ))
            ) : (
              // Empty State jika pencarian tidak ditemukan
              <div className="py-16 text-center">
                <div className="flex justify-center mb-4">
                  <Image src="/icons/VectorSearchHitam.svg" alt="Search" width={48} height={48} className="brightness-0" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Pasien tidak ditemukan</h3>
                <p className="text-sm text-slate-500 mt-1">Belum ada data pasien atau coba gunakan kata kunci lain.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}