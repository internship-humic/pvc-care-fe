'use client';

import Navbar from '@/components/Navbar';
import PasienDashboard from '@/components/PasienDashboard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPasienPage() {
  const router = useRouter();
  const { userData, loading } = useAuth();

  useEffect(() => {
    if (!loading && userData) {
      const roleValue = String(userData.role || userData.user_role || '').toLowerCase();
      const isAdmin = roleValue === 'admin';
      const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');
      if (isAdmin || isDoctor) {
        router.push('/dashboard');
      }
    }
  }, [userData, loading, router]);

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* ==================== NAVBAR ==================== */}
      <Navbar userData={userData} />

      {/* ==================== KONTEN DASHBOARD PASIEN ==================== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <PasienDashboard userData={userData} />
      </main>

    </div>
  );
}
