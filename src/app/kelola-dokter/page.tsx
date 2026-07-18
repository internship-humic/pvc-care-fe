'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function KelolaDokterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/doctor-profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userStr);
    setUserData(parsedUser);

    const roleValue = String(parsedUser?.role || parsedUser?.user_role || parsedUser?.type || '').toLowerCase();
    if (roleValue !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchDoctors().finally(() => setIsLoading(false));
  }, [router]);

  const handleVerify = async (id: string, status: 'Verified' | 'Declined') => {
    setIsSubmitting(id);
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
        await fetchDoctors();
      } else {
        alert("Gagal memperbarui status verifikasi");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(null);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Kelola Dokter...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-12">
      <Navbar userData={userData} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Kelola Dokter</h1>
          <p className="text-slate-500 mt-1">Verifikasi pendaftaran akun dokter baru dan kelola akses dokter aktif.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-lg">Daftar Akun Dokter</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase bg-slate-50/30">
                  <th className="p-4 pl-6">Dokter</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Spesialisasi</th>
                  <th className="p-4">No. Telepon</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Tidak ada data dokter terdaftar.</td>
                  </tr>
                ) : (
                  doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          {doc.profile_photo ? (
                            <img src={`http://localhost:8000${doc.profile_photo}`} alt={doc.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm uppercase">
                              {doc.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-800">{doc.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{doc.gender === 'Male' ? 'Laki-laki' : doc.gender === 'Female' ? 'Perempuan' : doc.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{doc.user?.email || '-'}</td>
                      <td className="p-4 font-medium text-slate-700">{doc.specialization}</td>
                      <td className="p-4 text-slate-600">{doc.phone}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${doc.verification_status === 'Verified' ? 'bg-green-50 text-green-700 border border-green-200' : doc.verification_status === 'Declined' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                          {doc.verification_status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {doc.verification_status === 'Pending' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              disabled={isSubmitting === doc.id}
                              onClick={() => handleVerify(doc.id, 'Declined')}
                              className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition disabled:opacity-50"
                            >
                              Tolak
                            </button>
                            <button
                              disabled={isSubmitting === doc.id}
                              onClick={() => handleVerify(doc.id, 'Verified')}
                              className="px-3 py-1.5 bg-[#4880FF] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm transition disabled:opacity-50"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Selesai diproses</span>
                        )}
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
