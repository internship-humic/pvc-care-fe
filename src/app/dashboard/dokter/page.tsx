'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function KelolaDokterPage() {
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
          const parsedUser = JSON.parse(userStr);
          setUserData(parsedUser);
          
          // Redirect if not admin
          const roleValue = String(parsedUser?.role || parsedUser?.user_role || parsedUser?.type || '').toLowerCase();
          if (roleValue !== 'admin') {
            router.push('/dashboard');
          }
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* ==================== NAVBAR ==================== */}
      <Navbar userData={userData} />

      {/* ==================== KONTEN KELOLA DOKTER ==================== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Kelola Dokter</h2>
              <p className="text-slate-500 text-sm mt-1">Daftar dokter yang terdaftar di sistem PVCare.</p>
            </div>
          </div>
          
          <DoctorTable />
        </div>
      </main>

    </div>
  );
}

function DoctorTable() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/doctor-profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
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
        fetchDoctors(); // Refresh data
      } else {
        alert("Gagal memperbarui status verifikasi");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-slate-500">Memuat data dokter...</div>;
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <div className="text-5xl mb-4">👥</div>
        <h3 className="text-lg font-bold text-slate-700 mb-1">Data Dokter Kosong</h3>
        <p className="text-slate-500 text-sm">Belum ada dokter yang terdaftar di sistem.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Dokter</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Daftar</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {doctors.map((doc) => (
            <tr key={doc.id} className="hover:bg-slate-50 transition">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                    {doc.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{doc.name}</div>
                    <div className="text-xs text-slate-500">{doc.user?.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {doc.phone}<br/>
                <span className="text-xs text-slate-400">{doc.gender}</span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {new Date(doc.user?.created_at).toLocaleDateString('id-ID')}
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  doc.verification_status === 'Verified' ? 'bg-green-100 text-green-700' :
                  doc.verification_status === 'Declined' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {doc.verification_status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                {doc.verification_status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleVerify(doc.id, 'Verified')}
                      className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-700 transition">
                      Approve
                    </button>
                    <button 
                      onClick={() => handleVerify(doc.id, 'Declined')}
                      className="text-xs font-bold border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                      Tolak
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
