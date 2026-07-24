import { useEffect, useState } from 'react';
import StatCard from './StatCard';

export default function PasienDashboard({ userData }: { userData: any }) {
  const userName = userData?.patient_profile?.name || userData?.profile?.name || userData?.name || 'Pasien';
  const [summary, setSummary] = useState<any>(null);
  const [lastScan, setLastScan] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [sumRes, histRes] = await Promise.all([
          fetch('http://localhost:8000/api/pvc-scans/history/summary', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:8000/api/pvc-scans/history', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (sumRes.ok) {
          const data = await sumRes.json();
          setSummary(data.data);
        }
        if (histRes.ok) {
          const data = await histRes.json();
          const scans = data.data?.data || [];
          if (scans.length > 0) {
            setLastScan(scans[0]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-semibold text-slate-500">Hi, <span className="text-slate-800 capitalize">{userName}</span> <span className="text-xl">😊</span></h1>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Pemeriksaan Terakhir</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-blue-100 shadow-sm p-5 overflow-hidden animate-fade-in-up delay-100">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-blue-700 text-lg">Premature Ventricular Contractions</h3>
           </div>
           <div className="w-full h-40 bg-pink-50/50 border border-pink-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
             {lastScan?.document_url ? (
               <img src={`http://localhost:8000${lastScan.document_url}`} alt="ECG" className="w-full h-full object-cover" />
             ) : (
               <span className="text-pink-300 text-sm">Grafik ECG di sini</span>
             )}
           </div>
           <div className="flex items-center gap-3">
             <div className="bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 flex items-center gap-2">
               Status Analisis AI: <strong className="text-slate-800">{lastScan?.ai_result || "Belum Dianalisis"}</strong>
             </div>
             {lastScan && (
               <span className={`text-xs px-2 py-1 rounded-full font-bold ${lastScan.verification_status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                 {lastScan.verification_status}
               </span>
             )}
           </div>
        </div>

        <div className="lg:col-span-5 bg-[#4880FF] text-white rounded-2xl shadow-sm p-6 flex flex-col justify-between animate-fade-in-up delay-200">
           <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">🩺</div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-blue-600 px-2 py-1 rounded-full">Catatan Dokter</span>
           </div>
           <div>
             <h4 className="font-bold mb-2">{lastScan?.doctor?.name || "Belum ada dokter"}</h4>
             <p className="text-blue-100 text-xs leading-relaxed line-clamp-4">
               {lastScan?.doctor_note || "Tidak ada catatan dari dokter."}
             </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-fade-in-up delay-100"><StatCard icon={<img src="/icons/totalPemeriksaan.svg" alt="Total Pemeriksaan" className="w-6 h-6 object-contain" />} title="Total Pemeriksaan" value={summary?.total_scans || 0} sub="Keseluruhan scan" color="blue" /></div>
        <div className="animate-fade-in-up delay-200"><StatCard icon="❤️" title="Terverifikasi" value={summary?.verified_count || 0} sub="Sudah diverifikasi dokter" color="red" /></div>
        <div className="animate-fade-in-up delay-300"><StatCard icon="🧠" title="AI Confidence" value={`${summary?.avg_confidence || 0}%`} sub="Rata-rata akurasi" color="green" /></div>
        <div className="animate-fade-in-up delay-400"><StatCard icon="🛡️" title="Pending" value={summary?.pending_count || 0} sub="Menunggu verifikasi" color="orange" /></div>
      </div>
    </div>
  );
}