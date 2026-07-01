import StatCard from './StatCard';

export default function PasienDashboard({ userData }: { userData: any }) {
  const userName = userData?.profile?.name || userData?.name || 'Pasien';

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
             <button className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 transition">Lihat Hasil</button>
           </div>
           <div className="w-full h-40 bg-pink-50/50 border border-pink-100 rounded-lg flex items-center justify-center mb-4">
             <span className="text-pink-300 text-sm">Grafik ECG di sini</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 flex items-center gap-2">
               Status Analisis AI: <strong className="text-slate-800">PVC Ringan Terdeteksi</strong>
             </div>
             <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Verified</span>
           </div>
        </div>

        <div className="lg:col-span-3 bg-[#4880FF] text-white rounded-2xl shadow-sm p-6 flex flex-col justify-between animate-fade-in-up delay-200">
           <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">🩺</div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-blue-600 px-2 py-1 rounded-full">Catatan Dokter</span>
           </div>
           <div>
             <h4 className="font-bold mb-2">Dr. Aitana Bonmati, Sp.JP, FIHA</h4>
             <p className="text-blue-100 text-xs leading-relaxed line-clamp-4">
               Berdasarkan hasil pemeriksaan terakhir, ritme jantung menunjukkan adanya PVC ringan. Tetap jaga pola makan dan kurangi kafein...
             </p>
           </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in-up delay-300">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">Riwayat</h3>
             <button className="text-slate-400 hover:text-blue-600 transition">•••</button>
           </div>
           <div className="space-y-4">
             <div className="flex items-center gap-3 border-b border-slate-100 pb-3 cursor-pointer group">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition">📅</div>
               <div>
                 <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition">24 May, 2026</p>
                 <p className="text-[10px] text-slate-500">PVC Ringan Terdeteksi</p>
               </div>
             </div>
             <div className="flex items-center gap-3 cursor-pointer group">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition">📅</div>
               <div>
                 <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition">1 May, 2026</p>
                 <p className="text-[10px] text-slate-500">Normal</p>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-fade-in-up delay-100"><StatCard icon="📋" title="Total Pemeriksaan" value="9" sub="Sejak 9 April, 2026" color="blue" /></div>
        <div className="animate-fade-in-up delay-200"><StatCard icon="❤️" title="Rata-rata BPM" value="63" sub="Normal BPM (60-100)" color="red" /></div>
        <div className="animate-fade-in-up delay-300"><StatCard icon="🧠" title="AI Confidence" value="93%" sub="Tingkat akurasi tinggi" color="green" /></div>
        <div className="animate-fade-in-up delay-400"><StatCard icon="🛡️" title="Tingkat Risiko" value="Rendah" sub="Risiko kardiovaskular" color="orange" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 h-64 flex flex-col justify-between animate-fade-in-up delay-300">
           <h3 className="font-bold text-blue-700">Tren PVC Pasien</h3>
           <div className="flex-1 bg-slate-50 mt-4 rounded border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400">Area Grafik Garis</div>
         </div>
         
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in-up delay-400">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-full">💡</div>
             <h3 className="font-bold text-blue-700">Insight AI</h3>
           </div>
           <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
             <p className="text-xs text-slate-600 leading-relaxed mb-3">Ritme ektopik terdeteksi sesekali, namun tidak ada pola aritmia berbahaya berlanjut.</p>
             <p className="text-xs font-bold text-slate-800">Rekomendasi:</p>
             <p className="text-xs text-blue-700 font-medium mt-1">Istirahat yang cukup dan hindari stres. Segera hubungi dokter jika dada terasa nyeri hebat.</p>
           </div>
         </div>
      </div>
    </div>
  );
}