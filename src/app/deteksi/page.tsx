'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

// --- DATA DOKTER DIAMBIL DARI API ---

export default function DeteksiPage() {
  const router = useRouter();
  
  // State User (Untuk Navbar)
  const [userData, setUserData] = useState<any>(null);

  // State Alur Halaman (1: Upload, 2: Loading, 3: Hasil, 4: Sukses)
  const [step, setStep] = useState(1);

  // State Upload File
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // State Simulasi Progress Bar
  const [progress, setProgress] = useState(0);

  // State Pilihan Dokter
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);

  // --- AMBIL DATA USER UNTUK NAVBAR ---
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
    } else {
      setUserData(JSON.parse(userStr));
    }

    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/doctor-profile/public', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await response.json();
        if (response.ok && resData.data) {
          const verifiedDoctors = resData.data.filter((d: any) => d.verification_status === "Verified");
          const mapped = verifiedDoctors.map((d: any) => ({
            id: d.id,
            name: d.name || 'Dokter',
            spec: d.specialization || 'Cardiology Specialist',
            rating: 4.9,
            patients: Math.floor(Math.random() * 500) + 100,
            img: d.profile_photo 
              ? (d.profile_photo.startsWith('/') ? `http://localhost:8000${d.profile_photo}` : `http://localhost:8000/images/${d.profile_photo}`)
              : `https://placehold.co/100x100/e2e8f0/64748b?text=DR`
          }));
          setDoctorsList(mapped);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, [router]);

  // --- FUNGSI DRAG & DROP ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // --- FUNGSI MULAI ANALISIS ---
  const handleStartAnalysis = async () => {
    if (!file) return;
    setStep(2);
    setProgress(0);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('http://localhost:8000/api/pvc-scans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.data) {
        setScanId(data.data.id);
      } else {
        alert("Gagal mengunggah scan: " + (data.message || "Unknown error"));
        setStep(1);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunggah scan");
      setStep(1);
    }
  };

  // --- SIMULASI LOADING (Step 2 -> Step 3) ---
  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(3), 500);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [step]);

  // --- FUNGSI RANDOM DOKTER ---
  const handleRandomizeDoctor = () => {
    if (doctorsList.length === 0) return;
    if (doctorsList.length === 1) {
      setSelectedDoctorId(doctorsList[0].id);
      return;
    }
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * doctorsList.length);
    } while (doctorsList[randomIndex].id === selectedDoctorId);
    
    setSelectedDoctorId(doctorsList[randomIndex].id);
  };

  // Otomatis pilihkan 1 dokter acak saat pertama kali masuk Step 3
  useEffect(() => {
    if (step === 3 && !selectedDoctorId && doctorsList.length > 0) {
      handleRandomizeDoctor();
    }
  }, [step, doctorsList, selectedDoctorId]);

  // --- FUNGSI KIRIM KE DOKTER (Step 3 -> Step 4) ---
  const handleSubmitToDoctor = async () => {
    if (!selectedDoctorId || !scanId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/pvc-scans/${scanId}/assign-doctor`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ doctor_profile_id: selectedDoctorId })
      });
      
      if (response.ok) {
        setStep(4);
      } else {
        const err = await response.json();
        alert("Gagal mengirim ke dokter: " + (err.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    }
  };

  // Mendapatkan detail dokter yang sedang terpilih saat ini
  const selectedDoctorDetail = doctorsList.find(d => d.id === selectedDoctorId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* ==================== NAVBAR ==================== */}
      <Navbar userData={userData} />

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* HEADER DINAMIS SESUAI STEP */}
        <div className="mb-8 animate-fade-in-up">
          {step === 1 && (
            <>
              <h2 className="text-xl font-medium text-slate-500">Deteksi Sekarang?</h2>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Upload Data ECG Anda</h1>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-xl font-medium text-slate-500">Tunggu sebentar</h2>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Data ECG Anda Sedang diproses</h1>
            </>
          )}
          {(step === 3 || step === 4) && (
            <>
              <h2 className="text-xl font-medium text-slate-500 flex items-center gap-2">Analisis selesai <span className="text-red-500">❤️</span></h2>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Verifikasi Hasil ke Dokter Anda</h1>
            </>
          )}
        </div>

        {/* --- STEP 1: UPLOAD ECG --- */}
        {step === 1 && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-10 animate-fade-in-up">
            <div className="flex flex-col items-center max-w-2xl mx-auto">
              
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Upload Data ECG</h3>
              <p className="text-sm text-slate-500 mt-1 mb-8">Drag and drop file ECG Anda atau klik untuk memilih file</p>

              <div 
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={`w-full border-[1.5px] border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-blue-300/50 hover:border-blue-400 bg-white'}`}
              >
                {file ? (
                  <div className="text-center">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">✅</div>
                    <p className="font-bold text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB • Siap dianalisis</p>
                    <button onClick={handleStartAnalysis} className="mt-6 px-8 py-2.5 bg-[#4880FF] hover:bg-blue-600 text-white font-bold rounded-full shadow-md transition-all">
                      Mulai Analisis AI
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="text-blue-500 w-12 h-12 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <p className="font-bold text-slate-800 text-lg">Pilih File ECG</p>
                    <p className="text-xs text-slate-500 mt-2 mb-6">Format yang didukung: CSV, TXT, ECG</p>
                    <label className="cursor-pointer bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-bold py-2.5 px-6 rounded-full text-sm shadow-sm transition">
                      Pilih File
                      <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".csv,.txt,.dat" />
                    </label>
                  </>
                )}
              </div>

              {/* Fitur Badges */}
              <div className="grid grid-cols-3 gap-4 w-full mt-8">
                <div className="bg-slate-100/70 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <img src="/streamline_artificial-intelligence-spark.png" alt="Fast" className="w-6 h-6 mb-1 object-contain" />
                   <p className="text-xs font-bold text-blue-600">AI Analysis</p>
                   <p className="text-[10px] text-slate-500">93% Accuracy</p>
                </div>
                <div className="bg-slate-100/70 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <img src="/mdi_encryption-secure-outline.png" alt="Fast" className="w-6 h-6 mb-1 object-contain" />
                   <p className="text-xs font-bold text-blue-600">Secure</p>
                   <p className="text-[10px] text-slate-500">Encrypted Data</p>
                </div>
                <div className="bg-slate-100/70 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <img src="/mdi_clock-fast.png" alt="Fast" className="w-8 h-8 mb-1 object-contain" />
                    <p className="text-xs font-bold text-blue-600">Fast</p>
                    <p className="text-[10px] text-slate-500">&lt;1 Minute</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: LOADING ANALISIS --- */}
        {step === 2 && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-16 flex flex-col items-center justify-center animate-fade-in-up">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl shadow-xl shadow-blue-500/30 mb-8 animate-pulse">
              🧠
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Menganalisis Data ECG...</h3>
            <p className="text-slate-500 mt-2 mb-10 text-center">AI sedang memproses data ECG Anda untuk mendeteksi PVC</p>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Checklist Indikator */}
            <div className="w-full max-w-md space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${progress > 10 ? 'bg-green-100 text-green-600' : 'border-2 border-slate-200 text-transparent'}`}>✓</div>
                <span className={`text-sm ${progress > 10 ? 'text-slate-800' : 'text-slate-400'}`}>Validating ECG data format</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${progress > 40 ? 'bg-green-100 text-green-600' : 'border-2 border-slate-200 text-transparent'}`}>✓</div>
                <span className={`text-sm ${progress > 40 ? 'text-slate-800' : 'text-slate-400'}`}>Preprocessing signal data</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${progress > 80 ? 'bg-green-100 text-green-600' : 'border-2 border-slate-200 text-transparent'}`}>✓</div>
                <span className={`text-sm ${progress > 80 ? 'text-slate-800' : 'text-slate-400'}`}>Running AI detection model...</span>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: HASIL & PILIH DOKTER ACAK --- */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Kartu Hasil Analisis */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8">
              <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-md shadow-green-500/30">✓</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Analisis AI Telah Selesai</h3>
                  <p className="text-sm text-slate-500">Data ECG Anda telah berhasil dianalisis. Berikut hasil deteksi PVC.</p>
                </div>
              </div>

              {/* 3 Box Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status Deteksi</p>
                  <p className="text-xl font-black text-slate-800 mt-1">PVC Detected</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">Premature Ventricular Contractions</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Confidence Level</p>
                  <p className="text-xl font-black text-slate-800 mt-1 mb-2">93.5%</p>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden"><div className="w-[93.5%] h-full bg-blue-500 rounded-full"></div></div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">PVC Frequency</p>
                  <p className="text-xl font-black text-slate-800 mt-1">12 / min</p>
                  <p className="text-xs text-slate-500 mt-2">Kategori: Ringan - Sedang</p>
                </div>
              </div>

              {/* Waveform Placeholder */}
              <div className="border border-slate-100 rounded-2xl p-6 mb-6">
                <h4 className="text-sm font-bold text-slate-800 mb-4">ECG Waveform - PVC Detection Visualization</h4>
                <div className="w-full h-32 flex items-center justify-center relative">
                  <svg className="w-full h-full text-blue-400" viewBox="0 0 500 100" preserveAspectRatio="none">
                    <polyline fill="none" stroke="currentColor" strokeWidth="2" points="0,50 50,50 60,30 70,70 80,50 150,50 160,20 170,80 180,50 250,50 260,10 270,90 280,50 350,50 360,30 370,70 380,50 450,50 460,20 470,80 480,50 500,50" />
                    <circle cx="160" cy="20" r="4" fill="#ef4444" />
                    <circle cx="260" cy="10" r="4" fill="#ef4444" />
                    <circle cx="460" cy="20" r="4" fill="#ef4444" />
                  </svg>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span><span className="text-xs text-slate-500">Normal Rhythm</span></div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-xs text-slate-500">PVC Detected</span></div>
                </div>
              </div>

              <div className="bg-slate-100/70 p-4 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-200/50">
                <strong className="text-slate-800">Catatan AI:</strong> Hasil analisis menunjukkan adanya PVC dengan frekuensi ringan hingga sedang. Disarankan untuk mendapatkan verifikasi dari dokter spesialis jantung untuk diagnosis yang lebih akurat.
              </div>
            </div>

            {/* Kartu Rekomendasi Dokter Acak */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Rekomendasi Dokter</h3>
                  <p className="text-sm text-slate-500 mt-1">Sistem memilihkan dokter spesialis berikut untuk memverifikasi hasil Anda</p>
                </div>
                <button 
                  onClick={handleRandomizeDoctor}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-full transition-all text-sm shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Cari Dokter Lain
                </button>
              </div>
              
              {/* Tampilan 1 Dokter Terpilih (Kunci key digunakan agar efek animasi berjalan ulang tiap dokter diganti) */}
              {selectedDoctorDetail && (
                <div key={selectedDoctorDetail.id} className="animate-fade-in-up p-5 rounded-2xl border-2 border-blue-500 bg-blue-50/30 flex items-center gap-5 mb-8 shadow-sm">
                  <img src={selectedDoctorDetail.img} alt={selectedDoctorDetail.name} className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800 text-lg">{selectedDoctorDetail.name}</h4>
                      <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Pilihan AI</span>
                    </div>
                    <p className="text-sm text-slate-500">{selectedDoctorDetail.spec}</p>
                    <p className="text-sm font-medium text-slate-600 mt-2 flex items-center gap-1.5">
                      <span className="text-orange-400 text-base">★</span> {selectedDoctorDetail.rating} 
                      <span className="text-slate-300 mx-2">|</span> 
                      <span className="text-blue-500">👤</span> {selectedDoctorDetail.patients} pasien
                    </p>
                  </div>
                </div>
              )}

              <button 
                onClick={handleSubmitToDoctor}
                disabled={!selectedDoctorId}
                className="w-full bg-[#4880FF] hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full shadow-md transition-all text-lg flex justify-center items-center gap-2"
              >
                <span>Kirim ke Dokter Ini</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 4: SUKSES --- */}
        {step === 4 && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-16 flex flex-col items-center justify-center animate-fade-in-up relative">
            <button onClick={() => router.push('/dashboard')} className="absolute top-6 right-6 border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 text-xs font-bold py-2 px-4 rounded-full transition-all">
              Kembali ke dashboard
            </button>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl shadow-xl shadow-green-500/30 mb-8 mt-4">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Hasil telah dikirim ke dokter</h3>
            <p className="text-slate-500 mt-2 text-center">Silahkan tunggu verifikasi dan catatan dari {selectedDoctorDetail?.name}</p>
          </div>
        )}

      </main>
    </div>
  );
}