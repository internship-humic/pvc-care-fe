'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifikasiPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- DUMMY DATA HASIL DETEKSI ---
  const detectionResult = {
    patientName: "Ahmad Hidayat",
    date: "25 Mei 2026",
    time: "10:30 WIB",
    bpm: 78,
    status: "Need Verification",
    // Simulasi path gambar ECG dari database
    ecgImage: "/ecg-sample.png", 
    notes: "Terdapat anomali pada kompleks QRS di lead II.",
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      
      {/* NAVBAR (Menu Verifikasi Aktif) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-blue-600">PVCare</span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/dashboard" className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium">Dashboard</Link>
          <Link href="/pasien" className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium">Pasien</Link>
          <Link href="/verifikasi" className="px-5 py-2 bg-[#4880FF] text-white rounded-full text-sm font-semibold shadow-sm">Verifikasi</Link>
          <Link href="/riwayat" className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium">Riwayat</Link>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold mb-6">Verifikasi Hasil Deteksi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: Detail & Gambar ECG */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4 text-slate-800">Visualisasi ECG</h3>
              <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <p className="text-slate-400">Gambar ECG akan tampil di sini</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4">Catatan Deteksi Sistem</h3>
              <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">{detectionResult.notes}</p>
            </div>
          </div>

          {/* KOLOM KANAN: Data Pasien & Aksi */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4">Data Pasien</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Nama Pasien</p>
                  <p className="font-semibold text-slate-800">{detectionResult.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Waktu Deteksi</p>
                  <p className="font-semibold text-slate-800">{detectionResult.date} • {detectionResult.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Detak Jantung (BPM)</p>
                  <p className="font-semibold text-red-500 text-xl">{detectionResult.bpm} BPM</p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition">Tolak</button>
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition">Verifikasi</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}