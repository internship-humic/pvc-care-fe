'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

// --- DATA DUMMY DAFTAR PASIEN ---
const DUMMY_PATIENTS = [
  { id: 1, name: "Ahmad Hidayat", age: 45, gender: "Laki-laki", email: "ahmad.hidayat@email.com", phone: "081234567890", lastVisit: "25 Mei 2026", totalTests: 10, status: "Verified", initials: "AH" },
  { id: 2, name: "Siti Nurhaliza", age: 52, gender: "Perempuan", email: "siti.nurhaliza@email.com", phone: "081234567891", lastVisit: "25 Mei 2026", totalTests: 11, status: "Pending", initials: "SN" },
  { id: 3, name: "Budi Santoso", age: 38, gender: "Laki-laki", email: "budi.santoso@email.com", phone: "081234567892", lastVisit: "15 Mei 2026", totalTests: 19, status: "Verified", initials: "BS" },
  { id: 4, name: "Dewi Lestari", age: 47, gender: "Perempuan", email: "dewi.lestari@email.com", phone: "081234567893", lastVisit: "15 Mei 2026", totalTests: 8, status: "Verified", initials: "DL" },
  { id: 5, name: "Budi Sudarsono", age: 43, gender: "Laki-laki", email: "budisono@email.com", phone: "081234567892", lastVisit: "15 Mei 2026", totalTests: 4, status: "Verified", initials: "BS" },
  { id: 6, name: "Chandra Pambudi", age: 26, gender: "Laki-laki", email: "cadera@email.com", phone: "081234567892", lastVisit: "12 Mei 2026", totalTests: 5, status: "Verified", initials: "CP" },
  { id: 7, name: "Calvin Winata", age: 25, gender: "Laki-laki", email: "cw@email.com", phone: "081234567892", lastVisit: "10 Mei 2026", totalTests: 7, status: "Verified", initials: "CW" },
  { id: 8, name: "Alfachri Gani", age: 25, gender: "Laki-laki", email: "alfachri@email.com", phone: "081234567892", lastVisit: "8 Mei 2026", totalTests: 2, status: "Verified", initials: "AG" },
  { id: 9, name: "Raihan Aziz", age: 38, gender: "Laki-laki", email: "raihan.aziz@email.com", phone: "081234567892", lastVisit: "7 Mei 2026", totalTests: 9, status: "Verified", initials: "RA" },
];

export default function PasienPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Fitur Search
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userStr);
      setUserData(parsedUser);
      
      // Keamanan Ekstra: Jika bukan dokter, tendang ke dashboard pasien
      const roleValue = String(parsedUser?.role || parsedUser?.user_role || parsedUser?.type || '').toLowerCase();
      const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');
      if (!isDoctor) {
        router.push('/dashboard');
      }
      
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memuat Data Pasien...</div>;
  }

  // Logika Pencarian (Search Filter)
  const filteredPatients = DUMMY_PATIENTS.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="grid grid-cols-12 gap-4 items-center px-8 py-4 hover:bg-slate-50/50 transition-colors duration-200">
                  
                  {/* Kolom 1: Avatar & Nama */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4880FF] text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20 shrink-0">
                      {patient.initials}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-800 truncate">{patient.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{patient.age} tahun · {patient.gender}</p>
                    </div>
                  </div>

                  {/* Kolom 2: Kontak */}
                  <div className="col-span-3 overflow-hidden">
                    <p className="text-sm font-medium text-slate-700 truncate">{patient.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{patient.phone}</p>
                  </div>

                  {/* Kolom 3: Last Visit */}
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-slate-700">{patient.lastVisit}</p>
                  </div>

                  {/* Kolom 4: Total Tests */}
                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-slate-800">{patient.totalTests}</p>
                  </div>

                  {/* Kolom 5: Status Badge */}
                  <div className="col-span-1">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      patient.status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'
                    }`}>
                      {patient.status}
                    </span>
                  </div>

                  {/* Kolom 6: Action Button */}
                  <div className="col-span-1 text-right flex justify-end">
                    <button className="flex items-center gap-1.5 text-[#4880FF] hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View
                    </button>
                  </div>

                </div>
              ))
            ) : (
              // Empty State jika pencarian tidak ditemukan
              <div className="py-16 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-slate-800">Pasien tidak ditemukan</h3>
                <p className="text-sm text-slate-500 mt-1">Coba gunakan kata kunci atau nama yang lain.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}