'use client';

import { useState, useEffect } from 'react';
import StatCard from './StatCard';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [docsRes, patsRes] = await Promise.all([
        fetch('http://localhost:8000/api/doctor-profile', { headers }),
        fetch('http://localhost:8000/api/patient-profile', { headers })
      ]);

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDoctors(docsData.data || []);
      }
      if (patsRes.ok) {
        const patsData = await patsRes.json();
        setPatients(patsData.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleVerify = async (id: string, status: 'Verified' | 'Declined') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/doctor-profile/${id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ verification_status: status })
      });
      if (res.ok) {
        fetchDashboardData(); // Refresh data
      } else {
        alert("Gagal memperbarui status verifikasi");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pendingDoctors = doctors.filter(doc => doc.verification_status === 'Pending');
  const activeDoctorsCount = doctors.filter(doc => doc.verification_status === 'Verified').length;

  if (isLoading) {
    return <div className="py-20 text-center text-slate-500">Memuat data panel...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Admin Control Panel</h2>
        <p className="text-slate-500 mt-1">Kelola akses sistem dan pantau aktivitas pengguna PVCare.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
          title="Total Fasilitas" 
          value="1" 
          color="blue" 
        />
        <StatCard 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>} 
          title="Total Pasien" 
          value={patients.length.toString()} 
          color="green" 
        />
        <StatCard 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
          title="Dokter Aktif" 
          value={activeDoctorsCount.toString()} 
          color="purple" 
        />
        <StatCard 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          title="Verifikasi Dokter" 
          value={pendingDoctors.length.toString()} 
          sub="Menunggu persetujuan" 
          color="orange" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Menunggu Verifikasi (Dokter)</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingDoctors.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">Tidak ada dokter yang menunggu verifikasi saat ini.</div>
            ) : (
              pendingDoctors.map((doc) => (
                <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-lg uppercase">
                      {doc.profile_photo ? (
                            <img src={`http://localhost:8000${doc.profile_photo}`} alt={doc.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm uppercase">
                              {doc.name.charAt(0)}
                            </div>
                          )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.user?.email} • Mendaftar: {new Date(doc.user?.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleVerify(doc.id, 'Declined')}
                      className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition"
                    >
                      Tolak
                    </button>
                    <button 
                      onClick={() => handleVerify(doc.id, 'Verified')}
                      className="px-4 py-2 bg-[#4880FF] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm transition"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Status Sistem AI</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600">Beban Server (CPU)</span>
                <span className="text-green-600">Aman (24%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[24%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600">Akurasi Model Deteksi</span>
                <span className="text-blue-600">98.2%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#4880FF] h-full w-[98%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600">Penyimpanan Database</span>
                <span className="text-blue-500">Normal (30%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full w-[30%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}