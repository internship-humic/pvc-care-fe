import { useEffect, useState } from 'react';
import StatCard from './StatCard';

export default function DokterDashboard({ userData }: { userData: any }) {
  const doctorName = userData?.doctor_profile?.name || userData?.profile?.name || userData?.name || 'Dokter';
  const verificationStatus = userData?.doctor_profile?.verification_status || userData?.profile?.verification_status || 'Pending';
  const isVerified = verificationStatus === 'Verified';

  const [summary, setSummary] = useState<any>(null);
  const [pendingScans, setPendingScans] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [sumRes, histRes] = await Promise.all([
          fetch('http://localhost:8000/api/pvc-scans/dashboard/summary', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:8000/api/pvc-scans/history', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (sumRes.ok) {
          const data = await sumRes.json();
          setSummary(data.data);
        }
        
        if (histRes.ok) {
          const data = await histRes.json();
          const scans = data.data?.data || [];
          // Filter out the ones that are pending
          const pending = scans.filter((s: any) => s.verification_status === "Pending");
          setPendingScans(pending.slice(0, 3)); // show top 3
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboardData();
  }, []);
  
  return (
    <div className="space-y-6">
      {!isVerified && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md shadow-sm animate-fade-in-up flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <p className="font-medium text-sm">Akun Anda sedang dalam proses verifikasi oleh Admin. Beberapa fitur utama mungkin belum dapat digunakan.</p>
        </div>
      )}

      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-slate-900">Dashboard Anda</h2>
        <p className="text-slate-500 mt-1 text-base">Selamat datang, <strong className="text-blue-600 capitalize">Dr. {doctorName}</strong>. Berikut ringkasan aktivitas Anda 😊</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-fade-in-up delay-100"><StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} title="Total Pasien" value={summary?.total_verifications || 0} sub="" color="blue" /></div>
        <div className="animate-fade-in-up delay-200"><StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Pasien Diverifikasi" value={summary?.verified_count || 0} sub="" color="green" /></div>
        <div className="animate-fade-in-up delay-300"><StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Menunggu Diverifikasi" value={summary?.pending_count || 0} sub="" color="purple" /></div>
        <div className="animate-fade-in-up delay-400"><StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} title="Rating Anda" value="4.9" sub="" color="orange" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in-up delay-300">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">Pending Verifications</h3>
             {isVerified ? (
               <button className="text-xs text-blue-600 font-bold hover:underline transition">Lihat Semua →</button>
             ) : (
               <span className="text-xs text-slate-400 font-bold cursor-not-allowed" title="Fitur ini terkunci">Lihat Semua 🔒</span>
             )}
           </div>
           <div className="space-y-3">
             {pendingScans.length === 0 && <div className="text-sm text-slate-500">Tidak ada scan yang pending.</div>}
             {pendingScans.map((item, i) => (
               <div key={i} className={`flex items-center justify-between p-3 border border-slate-100 rounded-xl transition-all group ${isVerified ? 'hover:bg-slate-50 cursor-pointer' : 'opacity-60 cursor-not-allowed bg-slate-50'}`}>
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center transition ${isVerified ? 'group-hover:bg-blue-600 group-hover:text-white' : ''}`}>{(item.patient?.name || "P")[0]}</div>
                   <div>
                     <p className={`font-bold text-slate-800 text-sm transition ${isVerified ? 'group-hover:text-blue-600' : ''}`}>{item.patient?.name || "Pasien"}</p>
                     <p className="text-[10px] text-slate-500">Uploaded: {new Date(item.created_at).toLocaleString('id-ID')}</p>
                   </div>
                 </div>
                 <div className="text-right flex items-center gap-4">
                   <div>
                     <p className="text-[10px] text-slate-400 font-medium">AI Confidence</p>
                     <p className="text-blue-600 font-extrabold text-lg leading-none mt-1">{item.ai_confidence}%</p>
                     <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full mt-1 inline-block text-orange-500 bg-orange-50`}>Pending</span>
                   </div>
                   {!isVerified && <span className="text-slate-300 text-xl" title="Terkunci">🔒</span>}
                 </div>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
}