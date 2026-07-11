'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function VerifikasiPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Referensi untuk elemen Canvas grafik ECG
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [verificationStatus, setVerificationStatus] = useState("confirm");
  const [diagClass, setDiagClass] = useState("Irama Normal");
  const [notes, setNotes] = useState("");
  
  // State for scans
  const [pendingScans, setPendingScans] = useState<any[]>([]);
  const [currentScan, setCurrentScan] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- AMBIL DATA USER ---
  useEffect(() => {
    const fetchInitialData = async () => {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!userStr || !token) {
        router.push('/login');
        return;
      }
      
      const parsedUser = JSON.parse(userStr);
      setUserData(parsedUser);
      
      const roleValue = String(parsedUser?.role || parsedUser?.user_role || parsedUser?.type || '').toLowerCase();
      const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');
      if (!isDoctor) {
        router.push('/dashboard');
        return;
      }
      
      try {
        const res = await fetch('http://localhost:5000/api/pvc-scan/history?status=Pending', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const scans = data.data?.data || [];
          setPendingScans(scans);
          if (scans.length > 0) {
            setCurrentScan(scans[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching pending scans:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, [router]);

  // --- LOGIKA MENGGAMBAR GRAFIK ECG (Diterjemahkan ke React) ---
  useEffect(() => {
    if (isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawECG = (w: number, h: number) => {
      // Clear
      ctx.clearRect(0, 0, w, h);

      // Draw Grid
      ctx.beginPath();
      ctx.strokeStyle = '#EDF2F7';
      ctx.lineWidth = 1;
      // Vertical
      for(let x=0; x<=w; x+=20) {
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }
      // Horizontal
      for(let y=0; y<=h; y+=20) {
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#A0AEC0';
      ctx.font = '10px Inter';
      ctx.fillText('14', 5, 20);
      ctx.fillText('10', 5, 60);
      ctx.fillText('7', 5, 120);
      ctx.fillText('3', 5, 180);
      ctx.fillText('0', 5, 250);
      
      // Draw Waveform
      ctx.beginPath();
      ctx.strokeStyle = '#4299E1'; // Brand Primary
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      
      const points = [];
      const centerY = 150;
      for(let i=0; i<w; i++) {
        let y = centerY;
        // P-wave
        y -= Math.sin(i * 0.1) * (i % 100 < 10 ? 5 : 0);
        // QRS
        if(i % 100 > 25 && i % 100 < 35) {
           y -= (i % 100 - 30) * (i % 100 < 30 ? -15 : 15);
        }
        // T-wave
        y -= Math.sin((i+20) * 0.05) * (i % 100 > 50 && i % 100 < 80 ? 10 : 0);
        
        points.push({x: i, y: y});
      }

      ctx.moveTo(points[0].x, points[0].y);
      for(let p of points) {
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Highlight PVC Beats (simulated position)
      const pvcSpots = [130, 430];
      pvcSpots.forEach(pos => {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(244, 63, 94, 0.1)';
        ctx.arc(pos, centerY - 20, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = '#F43F5E';
        ctx.arc(pos, centerY - 20, 30, 0, Math.PI * 2);
        ctx.stroke();
      });
    };

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Reset transform before scaling to prevent compounding scaling on resize
      ctx.setTransform(1, 0, 0, 1, 0, 0); 
      ctx.scale(dpr, dpr);
      
      drawECG(rect.width, rect.height);
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    
    return () => {
      window.removeEventListener('resize', setupCanvas);
    };
  }, [isLoading]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memuat Meja Kerja...</div>;
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* ==================== NAVBAR ==================== */}
      <Navbar userData={userData} />

      {/* ==================== KONTEN UTAMA ==================== */}
      <main className="max-w-7xl mx-auto px-8 py-10 animate-fade-in-up">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Verifikasi PVC</h1>
          <p className="text-slate-500 mt-1">Review dan verifikasi hasil analisis AI untuk pasien</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ==================== KOLOM KIRI ==================== */}
          <div className="col-span-1 lg:col-span-8 space-y-8">
            
            {/* INFORMASI PASIEN */}
            <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-semibold mb-6">Informasi Pasien</h2>
              
              {!currentScan ? (
                <div className="text-center py-10 text-slate-500">
                  Tidak ada scan yang perlu diverifikasi saat ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Nama Pasien</p>
                      <p className="font-bold text-slate-800">{currentScan.patient?.name || "Pasien"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Usia & Jenis Kelamin</p>
                      <p className="font-bold text-slate-800">
                        {currentScan.patient?.birthdate ? `${new Date().getFullYear() - new Date(currentScan.patient.birthdate).getFullYear()} tahun` : 'Tidak diketahui'} · {currentScan.patient?.gender === 'Male' ? 'Laki-laki' : currentScan.patient?.gender === 'Female' ? 'Perempuan' : 'Tidak diketahui'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Tanggal Upload</p>
                      <p className="font-bold text-slate-800">{new Date(currentScan.created_at).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Catatan Keluhan</p>
                      <p className="font-bold text-slate-800">{currentScan.patient_note || "Tidak ada catatan"}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ECG WAVEFORM */}
            <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-semibold mb-6">ECG Waveform Analysis</h2>
              <div className="relative w-full h-80 bg-slate-50 rounded-xl overflow-hidden mb-6 border border-slate-100 flex items-center justify-center">
                {currentScan?.image_url ? (
                   <img src={`http://localhost:5000${currentScan.image_url}`} alt="ECG" className="w-full h-full object-cover" />
                ) : (
                  <canvas ref={canvasRef} className="w-full h-full block" />
                )}
                
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg flex gap-4 text-xs font-medium border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                    <span>Normal Rhythm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span>PVC Detected</span>
                  </div>
                </div>
              </div>
            </section>

            {/* PANEL VERIFIKASI */}
            <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-semibold mb-6">Verification Panel</h2>
              <div className="space-y-6">
                
                {/* Status Selector */}
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-4">Status Verifikasi</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${verificationStatus === 'confirm' ? 'border-[#4299E1] bg-[#4299E1]/10' : 'border-slate-200 hover:bg-blue-50'}`}>
                      <input 
                        type="radio" 
                        name="verification_status" 
                        value="confirm" 
                        checked={verificationStatus === 'confirm'} 
                        onChange={() => setVerificationStatus('confirm')}
                        className="w-5 h-5 text-[#4299E1] focus:ring-[#4299E1]" 
                      />
                      <div className="ml-4">
                        <p className="font-bold text-slate-800">PVC Terkonfirmasi</p>
                        <p className="text-xs text-slate-500 mt-0.5">Hasil deteksi AI divalidasi sebagai PVC</p>
                      </div>
                    </label>
                    
                    <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${verificationStatus === 'reject' ? 'border-[#4299E1] bg-[#4299E1]/10' : 'border-slate-200 hover:bg-blue-50'}`}>
                      <input 
                        type="radio" 
                        name="verification_status" 
                        value="reject" 
                        checked={verificationStatus === 'reject'} 
                        onChange={() => setVerificationStatus('reject')}
                        className="w-5 h-5 text-[#4299E1] focus:ring-[#4299E1]" 
                      />
                      <div className="ml-4">
                        <p className="font-bold text-slate-800">Bukan PVC</p>
                        <p className="text-xs text-slate-500 mt-0.5">Gelombang ini tidak menunjukkan ciri PVC</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Additional Classification (Tampil jika "Bukan PVC" dipilih) */}
                {verificationStatus === 'reject' && (
                  <div className="bg-slate-50 p-6 rounded-2xl animate-fade-in-up">
                    <p className="text-sm font-medium text-slate-600 mb-4">Klasifikasi Diagnostik Tambahan:</p>
                    <div className="space-y-3">
                      {['Irama Normal', 'PAC (Premature Atrial Contraction)', 'Artefak / Gangguan Sinyal', 'Lainnya (Jelaskan detail di catatan)'].map((opt) => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="diag_class" 
                            value={opt}
                            checked={diagClass === opt}
                            onChange={() => setDiagClass(opt)}
                            className="w-4 h-4 text-[#4299E1] focus:ring-[#4299E1]" 
                          />
                          <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Textarea Notes */}
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Catatan Medis</p>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-32 rounded-2xl border border-slate-300 focus:border-[#4299E1] focus:ring focus:ring-[#4299E1]/20 p-4 text-sm resize-none outline-none transition" 
                    placeholder="Masukkan catatan medis, diagnosis, dan rekomendasi untuk pasien..." 
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  <button 
                    disabled={!currentScan || isSubmitting}
                    onClick={async () => {
                      if (!currentScan) return;
                      setIsSubmitting(true);
                      try {
                        const token = localStorage.getItem('token');
                        const finalResult = verificationStatus === 'confirm' ? 'PVC Terkonfirmasi' : diagClass;
                        
                        const res = await fetch(`http://localhost:5000/api/pvc-scan/${currentScan.id}/verify`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            final_result: finalResult,
                            doctor_note: notes
                          })
                        });
                        
                        if (res.ok) {
                          alert("Scan berhasil diverifikasi!");
                          window.location.reload();
                        } else {
                          const err = await res.json();
                          alert("Gagal memverifikasi scan: " + (err.message || 'Unknown error'));
                        }
                      } catch (error) {
                         alert("Terjadi kesalahan sistem.");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-full font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    {isSubmitting ? "Submitting..." : "Submit Verifikasi"}
                  </button>
                  <button onClick={() => router.push('/dashboard')} className="w-full border border-slate-200 text-slate-600 py-4 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    Kembali ke Dashboard
                  </button>
                </div>

              </div>
            </section>

          </div>

          {/* ==================== KOLOM KANAN (SIDEBAR AI) ==================== */}
          <aside className="col-span-1 lg:col-span-4">
            <div className="bg-[#2B6CB0] rounded-[2.5rem] p-8 text-white sticky top-28 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <h2 className="text-xl font-bold">AI Analysis Results</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                  <p className="text-xs text-white/60 font-medium mb-1 uppercase">Status Deteksi</p>
                  <p className="text-xl font-bold">{currentScan ? (currentScan.ai_result ? "PVC Detected" : "Normal") : "Menunggu"}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                  <p className="text-xs text-white/60 font-medium mb-1 uppercase">Confidence Level</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold">{currentScan?.ai_confidence || 0}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: `${currentScan?.ai_confidence || 0}%` }}></div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                  <p className="text-xs text-white/60 font-medium mb-1 uppercase">Kategori</p>
                  <p className="text-xl font-bold">{currentScan?.ai_result ? "Ringan - Sedang" : "Aman"}</p>
                </div>
              </div>

              <div className="mt-10 flex gap-3 text-white/70 text-[11px] leading-relaxed italic">
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p>AI model menggunakan deep learning architecture dengan akurasi validasi 98.2% pada dataset clinical ECG.</p>
              </div>

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}