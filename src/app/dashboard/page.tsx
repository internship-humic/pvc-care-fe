'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

// Import komponen yang sudah dipisah
import AdminDashboard from '../../components/AdminDashboard';
import DokterDashboard from '../../components/DokterDashboard';
import PasienDashboard from '../../components/PasienDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Dashboard...</div>;
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