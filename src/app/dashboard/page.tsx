'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

// Import komponen yang sudah dipisah
import AdminDashboard from '../../components/AdminDashboard';
import DokterDashboard from '../../components/DokterDashboard';
import PasienDashboard from '../../components/PasienDashboard';

export default function DashboardPage() {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-semibold">Memuat dashboard...</p>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  // --- DETEKSI 3 ROLE BERBEDA ---
  const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
  const isAdmin = roleValue === 'admin';
  const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');
  const isPatient = !isAdmin && !isDoctor;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* ==================== NAVBAR ==================== */}
      <Navbar userData={userData} />

      {/* ==================== KONTEN DINAMIS (MEMANGGIL KOMPONEN) ==================== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isAdmin && <AdminDashboard />}
        {isDoctor && <DokterDashboard userData={userData} />}
        {isPatient && <PasienDashboard userData={userData} />}
      </main>

    </div>
  );
}