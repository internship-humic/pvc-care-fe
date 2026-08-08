'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function RiwayatPage() {
  const router = useRouter();
  const { userData, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [scans, setScans] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const [histRes, sumRes] = await Promise.all([
        fetch('http://localhost:8000/api/pvc-scans/history', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:8000/api/pvc-scans/history/summary', { headers: { 'Authorization': `Bearer ${token}` } })
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

  useEffect(() => {
    if (authLoading) return;
    if (!userData) {
      router.push('/login');
      return;
    } 
    fetchHistory();
  }, [router, userData, authLoading]);

  if (authLoading || isLoading) {
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
        {isDoctor ? (
          <DoctorRiwayat scans={scans} summary={summary} />
        ) : (
          <PatientRiwayat scans={scans} summary={summary} onRefresh={fetchHistory} />
        )}
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
function PatientRiwayat({ scans, summary, onRefresh }: { scans: any[], summary: any, onRefresh?: () => void }) {
  const [selectedScan, setSelectedScan] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReVerifyOpen, setIsReVerifyOpen] = useState(false);

  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [patientNote, setPatientNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const getDoctorImage = (photo?: string) => {
    if (!photo) return "https://placehold.co/100x100/e2e8f0/64748b?text=DR";
    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }
    const prefix = photo.startsWith("/") ? "" : "/";
    return `http://localhost:8000${prefix}${photo}`;
  };

  const getFormattedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getFormattedTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const openReVerifyModal = async (scan: any) => {
    setSelectedScan(scan);
    setPatientNote(scan.patient_note || '');
    setSelectedDoctorId(scan.doctor_profile_id || '');
    setIsReVerifyOpen(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (doctorsList.length === 0) {
      setLoadingDoctors(true);
      try {
        const res = await fetch('http://localhost:8000/api/doctor-profile/public');
        if (res.ok) {
          const data = await res.json();
          setDoctorsList(data.data || data || []);
        } else {
          setErrorMsg('Gagal memuat daftar dokter.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Gagal terhubung ke server.');
      } finally {
        setLoadingDoctors(false);
      }
    }
  };

  const handleReVerifySubmit = async () => {
    if (!selectedScan) return;
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/pvc-scans/${selectedScan.id}/assign-doctor`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_note: patientNote,
          doctor_profile_id: selectedDoctorId || null
        })
      });

      if (res.ok) {
        setSuccessMsg('Verifikasi ulang berhasil diajukan!');
        setTimeout(() => {
          setIsReVerifyOpen(false);
          setSelectedScan(null);
          setSuccessMsg('');
          if (onRefresh) onRefresh();
        }, 1500);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || 'Gagal mengajukan verifikasi ulang.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal menghubungi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="bg-white border-2 border-cyan-400 rounded-3xl p-5 flex items-center gap-4 shadow-sm shadow-cyan-100 hover:-translate-y-1 transition duration-300">
          <div className="w-14 h-14 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center text-2xl border border-cyan-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Rata-rata Confidence AI</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">
              {summary?.avg_confidence ? summary.avg_confidence + '%' : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border-[1.5px] border-blue-400/50 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Riwayat Saya</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {scans.length === 0 && <div className="p-8 text-center text-slate-500">Belum ada riwayat</div>}
          {scans.map((item) => {
            return (
              <div key={item.id} className="p-8 hover:bg-slate-50/50 transition">
                {/* 1. Header Item */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-slate-800 text-base">{getFormattedDate(item.created_at)}</span>
                    <span className="text-slate-400 text-sm">{getFormattedTime(item.created_at)}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.verification_status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.verification_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setSelectedScan(item); setIsDetailOpen(true); }}
                      className="bg-[#4880FF] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <span>Detail</span>
                    </button>
                    <button 
                      onClick={() => openReVerifyModal(item)}
                      className="bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-500 text-slate-600 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      <span>Re-verify</span>
                    </button>
                  </div>
                </div>

                {/* 2. Informasi Dokter */}
                <div className="flex items-center gap-4 py-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    {item.doctor?.profile_photo ? (
                      <img 
                        src={getDoctorImage(item.doctor.profile_photo)} 
                        alt={item.doctor.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/100x100/e2e8f0/64748b?text=DR";
                        }}
                      />
                    ) : (
                      <svg className="w-5 h-5 text-slate-400 m-auto mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-snug">{item.doctor?.name || 'Belum dipilih'}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-xs text-slate-500">{item.doctor?.specialization || 'Cardiology Specialist'}</span>
                      </div>
                    </div>
                    <div className="border-l border-slate-200 h-6 hidden sm:block"></div>
                    <div className="text-xs text-slate-500 font-medium">
                      AI Confidence: <span className="text-blue-500 font-bold">{item?.ai_confidence || 0}%</span>
                    </div>
                  </div>
                </div>

                {/* 3. Catatan Dokter (Kotak Abu-abu) */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-4 text-sm text-slate-600">
                  <span className="font-bold text-slate-700 block mb-1">Catatan Dokter</span>
                  <p className="leading-relaxed">{item.doctor_note || 'Menunggu verifikasi dokter.'}</p>
                </div>

                {/* 4. Grid AI Analysis & ECG Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Kolom Kiri (AI Analysis Results) */}
                  <div className="border border-slate-200/80 rounded-2xl p-5 bg-white flex flex-col justify-between space-y-3 shadow-sm">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Status Deteksi</span>
                      <span className="font-bold text-slate-800">{item.ai_result || 'Normal Rhythm'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Confidence Level</span>
                      <span className="font-bold text-blue-500">{item.ai_confidence ? `${item.ai_confidence}%` : '0%'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">PVC Frequency</span>
                      <span className="font-bold text-slate-800">12 / min</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Kategori</span>
                      <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs">{item.risk_level || 'Ringan - Sedang'}</span>
                    </div>
                  </div>

                  {/* Kolom Kanan (ECG Preview) */}
                  <div className="border border-slate-200/80 rounded-2xl p-4 bg-white flex items-center justify-center h-full shadow-sm">
                    {item.document_url ? (
                      <img 
                        src={`http://localhost:8000${item.document_url}`} 
                        alt="ECG Preview" 
                        className="w-full h-32 object-cover rounded-md" 
                      />
                    ) : (
                      <div className="w-full h-32 bg-slate-50 rounded-md flex items-center justify-center text-xs text-slate-400">
                        Tidak ada data ECG
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== POPUP: DETAIL MODAL ==================== */}
      {isDetailOpen && selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 font-sans">Detail Riwayat Deteksi</h3>
              <button 
                onClick={() => { setIsDetailOpen(false); setSelectedScan(null); }}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Date and Status */}
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Tanggal Deteksi</p>
                  <p className="font-bold text-slate-800">{getFormattedDate(selectedScan.created_at)} {getFormattedTime(selectedScan.created_at)}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${selectedScan.verification_status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {selectedScan.verification_status}
                </span>
              </div>

              {/* ECG Image Preview (Larger) */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">Grafik ECG</h4>
                {selectedScan.document_url ? (
                  <div className="relative group overflow-hidden border border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center p-2">
                    <img 
                      src={`http://localhost:8000${selectedScan.document_url}`} 
                      alt="ECG Large Preview" 
                      className="w-full h-64 object-contain rounded-xl"
                    />
                    <a 
                      href={`http://localhost:8000${selectedScan.document_url}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold transition duration-200 gap-2 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Buka di Tab Baru
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex items-center justify-center text-slate-400 text-sm">
                    Tidak ada gambar ECG
                  </div>
                )}
              </div>

              {/* AI & Verification Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Analysis */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-2 mb-2">Hasil Analisis AI</h4>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Status Jantung</span>
                    <span className="text-xs font-bold text-slate-800">{selectedScan.ai_result || 'Normal Rhythm'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Confidence AI</span>
                    <span className="text-xs font-bold text-blue-600">{selectedScan.ai_confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Kategori Risiko</span>
                    <span className="text-xs font-bold text-amber-600">{selectedScan.risk_level || 'Ringan - Sedang'}</span>
                  </div>
                </div>

                {/* Patient Note */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-2 mb-2">Catatan Pasien</h4>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    {selectedScan.patient_note || 'Tidak ada catatan tambahan dari pasien.'}
                  </p>
                </div>
              </div>

              {/* Doctor Verification Details */}
              <div className="border border-slate-200/80 rounded-2xl p-5 bg-white space-y-4">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Status Verifikasi Dokter</h4>
                {selectedScan.verification_status === 'Verified' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getDoctorImage(selectedScan.doctor?.profile_photo)} 
                        alt={selectedScan.doctor?.name} 
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{selectedScan.doctor?.name}</p>
                        <p className="text-xs text-slate-500">{selectedScan.doctor?.specialization || 'Spesialis Jantung'}</p>
                      </div>
                    </div>
                    <div className="bg-[#4880FF]/5 border border-[#4880FF]/10 rounded-xl p-4 text-xs text-slate-700">
                      <span className="font-bold text-slate-800 block mb-1">Catatan Medis Dokter:</span>
                      <p className="leading-relaxed">{selectedScan.doctor_note || 'Tidak ada catatan khusus.'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">Menunggu Verifikasi</p>
                      <p className="text-xs text-slate-400 mt-0.5">Hasil ECG Anda sedang mengantre untuk diverifikasi oleh dokter {selectedScan.doctor?.name ? `(Dr. ${selectedScan.doctor.name})` : ''}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => { setIsDetailOpen(false); setSelectedScan(null); }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-2xl text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== POPUP: RE-VERIFY MODAL ==================== */}
      {isReVerifyOpen && selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 font-sans">Ajukan Verifikasi Ulang</h3>
              <button 
                onClick={() => { setIsReVerifyOpen(false); setSelectedScan(null); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Ajukan hasil scan ini kembali kepada dokter spesialis untuk diverifikasi ulang. Anda dapat memilih dokter yang spesifik atau menambahkan deskripsi keluhan tambahan.
              </p>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-100 text-xs p-3.5 rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="bg-green-50 text-green-600 border border-green-100 text-xs p-3.5 rounded-xl font-medium">
                  {successMsg}
                </div>
              )}

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Pilih Dokter Spesialis</label>
                  {loadingDoctors ? (
                    <div className="text-xs text-slate-400">Memuat daftar dokter...</div>
                  ) : (
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 transition cursor-pointer font-sans"
                    >
                      <option value="">-- Pilih Dokter (Atau Acak/Semua) --</option>
                      {doctorsList.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} - {doc.specialization || 'Cardiology'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Catatan/Keluhan untuk Dokter</label>
                  <textarea
                    rows={4}
                    value={patientNote}
                    onChange={(e) => setPatientNote(e.target.value)}
                    placeholder="Jelaskan secara singkat gejala atau alasan mengapa Anda meminta verifikasi ulang..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 resize-none transition font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
              <button 
                onClick={() => { setIsReVerifyOpen(false); setSelectedScan(null); setErrorMsg(''); setSuccessMsg(''); }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button 
                onClick={handleReVerifySubmit}
                className="bg-[#4880FF] hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Kirim Permintaan</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}