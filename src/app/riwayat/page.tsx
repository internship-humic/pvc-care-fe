'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function RiwayatPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scans, setScans] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    } 
    const parsedUser = JSON.parse(userStr);
    setUserData(parsedUser);
    
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const [histRes, sumRes] = await Promise.all([
          fetch('http://localhost:5000/api/pvc-scan/history', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/pvc-scan/history/summary', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        if (histRes.ok) {
          const data = await histRes.json();
          setScans(data.data?.data || []);
        }
        if (sumRes.ok) {
          const data = await sumRes.json();
          setSummary(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memuat Riwayat...</div>;
  }

  const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
  const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      
      {/* ==================== NAVBAR ==================== */}
      <Navbar userData={userData} />

      {/* ==================== KONTEN UTAMA ==================== */}
      <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in-up">
        {isDoctor ? <DoctorRiwayat scans={scans} summary={summary} /> : <PatientRiwayat scans={scans} summary={summary} />}
      </main>

    </div>
  );
}

// ============================================================================
// KOMPONEN: RIWAYAT DOKTER
// ============================================================================
function DoctorRiwayat({ scans, summary }: { scans: any[], summary: any }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Riwayat Verifikasi</h1>
        <p className="text-slate-500 text-lg mt-1">Lihat semua verifikasi PVC yang telah Anda selesaikan</p>
      </div>

      {/* KARTU STATISTIK (4 Kolom) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="bg-white border-2 border-blue-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-blue-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl border border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Total Scans</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{summary?.total_scans || 0}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-green-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-green-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-2xl border border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Approved</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{summary?.verified_count || 0}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-purple-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-purple-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-2xl border border-purple-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Pending</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{summary?.pending_count || 0}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-cyan-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-cyan-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center text-2xl border border-cyan-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Avg. Confidence</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{summary?.avg_confidence || 0}%</p>
          </div>
        </div>

      </div>

      {/* DAFTAR RIWAYAT */}
      <div className="bg-white rounded-3xl shadow-sm border-[1.5px] border-blue-400/50 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Verification History</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {scans.length === 0 && <div className="p-8 text-center text-slate-500">Belum ada riwayat</div>}
          {scans.map((item) => (
            <div key={item.id} className="p-8 hover:bg-slate-50/50 transition">
              <div className="flex items-start gap-4">
                
                {/* Ikon Check Hijau */}
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-xl shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-800 text-lg">{item.patient?.name || 'Pasien'}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.verification_status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{item.verification_status}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(item.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                      AI Confidence: <strong className="text-blue-500 ml-1">{item.ai_confidence}%</strong>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] rounded-xl p-4 text-sm text-slate-700">
                    <strong>Catatan Dokter:</strong> {item.doctor_note || 'Tidak ada catatan.'}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// KOMPONEN: RIWAYAT PASIEN
// ============================================================================
function PatientRiwayat({ scans, summary }: { scans: any[], summary: any }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Riwayat Deteksi Saya</h1>
        <p className="text-slate-500 text-lg mt-1">Lihat riwayat analisis PVC Anda</p>
      </div>
      
      {/* KARTU STATISTIK */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white border-2 border-blue-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-blue-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl border border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Total Scans</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{summary?.total_scans || 0}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-green-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-green-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-2xl border border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Verified</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{summary?.verified_count || 0}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-purple-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-purple-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-2xl border border-purple-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Pending</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{summary?.pending_count || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border-[1.5px] border-blue-400/50 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Riwayat Saya</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {scans.length === 0 && <div className="p-8 text-center text-slate-500">Belum ada riwayat</div>}
          {scans.map((item) => (
            <div key={item.id} className="p-8 hover:bg-slate-50/50 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-800 text-lg">Dokter: {item.doctor?.name || 'Belum dipilih'}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.verification_status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{item.verification_status}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(item.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#F1F5F9] rounded-xl p-4 text-sm text-slate-700">
                    <strong>Catatan AI:</strong> {item.ai_result || 'Belum ada hasil AI'} <br/>
                    <strong>Catatan Anda:</strong> {item.patient_note || 'Tidak ada catatan.'} <br/>
                    <strong>Catatan Dokter:</strong> {item.doctor_note || 'Menunggu verifikasi dokter.'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}