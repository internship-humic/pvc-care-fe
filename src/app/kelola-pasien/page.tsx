'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function KelolaPasienPage() {
  const router = useRouter();
  const { userData, loading: authLoading, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);

  const fetchPatients = async () => {
    try {
      if (!token) return;
      const res = await fetch('http://localhost:8000/api/patient-profile', {
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
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!userData) {
      router.push('/login');
      return;
    }

    const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
    if (roleValue !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchPatients().finally(() => setIsLoading(false));
  }, [router, userData, authLoading, token]);

  const calculateAge = (birthdateStr: string) => {
    if (!birthdateStr) return '-';
    const birthdate = new Date(birthdateStr);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return `${age} tahun`;
  };

  if (authLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Kelola Pasien...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-12">
      <Navbar userData={userData} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Kelola Pasien</h1>
          <p className="text-slate-500 mt-1">Lihat dan pantau seluruh pasien yang terdaftar di PVCare.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-lg">Daftar Pasien Terdaftar</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase bg-slate-50/30">
                  <th className="p-4 pl-6">Pasien</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">No. Telepon</th>
                  <th className="p-4">Tanggal Lahir</th>
                  <th className="p-4">Umur</th>
                  <th className="p-4 pr-6">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Tidak ada data pasien terdaftar.</td>
                  </tr>
                ) : (
                  patients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 font-bold flex items-center justify-center text-sm uppercase">
                            {pat.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{pat.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{pat.gender === 'Male' ? 'Laki-laki' : pat.gender === 'Female' ? 'Perempuan' : pat.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{pat.user?.email || '-'}</td>
                      <td className="p-4 text-slate-600">{pat.phone}</td>
                      <td className="p-4 text-slate-600">
                        {pat.birthdate ? new Date(pat.birthdate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{calculateAge(pat.birthdate)}</td>
                      <td className="p-4 pr-6 text-slate-500">
                        {pat.user?.created_at ? new Date(pat.user.created_at).toLocaleDateString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
