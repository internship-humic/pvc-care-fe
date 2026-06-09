'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'pasien' | 'dokter'>('pasien');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (role === 'dokter' && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password dan Konfirmasi Password tidak cocok!' });
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = role === 'pasien' 
        ? 'http://localhost:8000/api/auth/register/patient' 
        : 'http://localhost:8000/api/auth/register/doctor';

      let bodyData;
      let headers: HeadersInit = { 'Content-Type': 'application/json' }; // Kita pakai JSON untuk keduanya

      if (role === 'dokter') {
        // 1. Fungsi Kompresi Gambar & Ubah ke Base64
        let photoString = "";
        
        if (profileImage) {
          try {
            // Opsi kompresi: Maksimal 150 KB (0.15 MB) dan dimensi maksimal 800px
            const options = {
              maxSizeMB: 0.15,
              maxWidthOrHeight: 800,
              useWebWorker: true,
            };

            // Proses "diet" gambar secara otomatis
            const compressedFile = await imageCompression(profileImage, options);

            // Ubah file yang sudah ramping menjadi string Base64
            photoString = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(compressedFile);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = error => reject(error);
            });
            
          } catch (error) {
            console.error("Error saat kompresi gambar:", error);
            setMessage({ type: 'error', text: 'Gagal memproses foto profil. Coba gambar lain.' });
            setIsLoading(false);
            return; // Hentikan proses jika kompresi gagal
          }
        }

        // 2. Bungkus sebagai JSON biasa (Sama seperti pasien, ditambah foto)
        bodyData = JSON.stringify({
          email: formData.email,
          password: formData.password,
          profile: {
            name: formData.name,
            phone: formData.phone,
            gender: formData.gender,
            birthdate: formData.birthDate, 
            profile_photo: photoString || "default.png" 
          }
        });
        
      } else {
        // STRUKTUR DATA PASIEN
        bodyData = JSON.stringify({
          email: formData.email,
          password: formData.password,
          profile: {
            name: formData.name,
            phone: formData.phone,
            gender: formData.gender,     
            birthdate: formData.birthDate 
          }
        });
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: bodyData,
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('Server tidak merespons dengan JSON.');
      }

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registrasi berhasil! Mengalihkan ke halaman login...' });
        setTimeout(() => {
          // Ganti dengan router.push('/login') jika kamu sudah memasang useRouter
          window.location.href = '/login'; 
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || data.error || 'Gagal melakukan registrasi' });
      }
    } catch (error: any) {
      console.error("Detail Error:", error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans antialiased relative">

      <Link href="/" className="absolute top-6 right-6 lg:right-10 z-50 p-2 text-slate-400 hover:text-slate-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Link>

      {/* ==================== PANEL KIRI ==================== */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-b from-blue-600 to-blue-400 relative overflow-hidden flex-col justify-between">
        <div className="pt-12 pl-12 z-10 flex items-center gap-3">
          <div className="text-white flex items-center justify-center text-3xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              <path d="M11 11V8h2v3h3v2h-3v3h-2v-3H8v-2h3z" fill="#3F8BFF" />
            </svg>
          </div>
          <span className="text-4xl font-bold text-white tracking-tight">PVCare</span>
        </div>

        <div className="relative h-[75%] w-full flex items-end justify-center">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full border-[20px] border-white/10 z-0"></div>
          <img src="https://placehold.co/800x600/transparent/white?text=Gambar+3+Dokter" alt="Doctors" className="relative z-10 object-cover w-[90%] h-auto" />

          <div className={`absolute top-[30%] left-10 z-20 bg-slate-900/60 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 text-white shadow-xl transition-all duration-500 ease-out transform ${role === 'pasien' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">🔍</div>
            <div>
              <p className="font-semibold text-sm leading-none">Well qualified doctors</p>
              <p className="text-xs text-slate-300 mt-1">Dengan dokter professional</p>
            </div>
          </div>
          <div className={`absolute bottom-24 right-10 z-20 bg-slate-900/60 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 text-white shadow-xl transition-all duration-500 ease-out delay-100 transform ${role === 'pasien' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">📈</div>
            <div>
              <p className="font-semibold text-sm leading-none">AI Detection</p>
              <p className="text-xs text-slate-300 mt-1">Deteksi hasil dengan AI</p>
            </div>
          </div>

          <div className={`absolute bottom-24 left-16 z-20 bg-slate-900/60 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 text-white shadow-xl transition-all duration-500 ease-out transform ${role === 'dokter' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">🏥</div>
            <div>
              <p className="font-bold text-base leading-none">Dokter Professional</p>
              <p className="text-sm text-slate-300 mt-1">Bergabunglah dengan kami!</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PANEL KANAN (Form & Dynamic Fields) ==================== */}
      <div className="w-full lg:w-[55%] flex flex-col justify-start items-center p-8 sm:p-12 overflow-y-auto pt-24">

        <div className="w-full max-w-xl">

          <div className="relative flex bg-slate-100 p-1 rounded-lg w-full max-w-[240px] mx-auto mb-10">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-transform duration-300 ease-out ${role === 'pasien' ? 'translate-x-0' : 'translate-x-full'}`}></div>
            <button onClick={() => setRole('pasien')} className={`relative z-10 flex-1 text-sm font-semibold py-2 transition-colors duration-300 ${role === 'pasien' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Pasien</button>
            <button onClick={() => setRole('dokter')} className={`relative z-10 flex-1 text-sm font-semibold py-2 transition-colors duration-300 ${role === 'dokter' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Dokter</button>
          </div>

          <div className="relative h-[80px] w-full mb-6">
            <div className={`absolute inset-0 w-full text-center transition-all duration-500 ease-out transform ${role === 'pasien' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Hey there</h1>
              <p className="text-slate-500 text-sm mt-2">Already know PVCare? <Link href="/login" className="text-blue-600 font-medium hover:underline">Log in</Link></p>
            </div>
            <div className={`absolute inset-0 w-full text-center transition-all duration-500 ease-out transform ${role === 'dokter' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Selamat datang dok!</h1>
              <p className="text-slate-500 text-sm mt-2">Sudah terdaftar? <Link href="/login" className="text-blue-600 font-medium hover:underline">Log in</Link></p>
            </div>
          </div>

          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative">
                {role === 'dokter' && (
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                )}
                {/* DITAMBAHKAN text-slate-900 dan placeholder:text-slate-400 */}
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder={role === 'pasien' ? "Jamal Musiala" : "Dr. Nama Lengkap"} className={`w-full py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-slate-900 placeholder:text-slate-400 ${role === 'dokter' ? 'pl-10 pr-4' : 'px-4'}`} />
              </div>
            </div>

            {role === 'pasien' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email address</label>
                  {/* DITAMBAHKAN text-slate-900 dan placeholder:text-slate-400 */}
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="musiala@gmail.com" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-slate-900 placeholder:text-slate-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-white border border-r-0 border-slate-300 rounded-l-lg text-sm gap-2 text-slate-600">
                      <span>🇮🇩</span> <span>+62</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    {/* DITAMBAHKAN text-slate-900 dan placeholder:text-slate-400 */}
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="1234567890" className="w-full px-4 py-2.5 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-slate-900 placeholder:text-slate-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nomor Telepon</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    {/* DITAMBAHKAN text-slate-900 dan placeholder:text-slate-400 */}
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="08xxxxxxxxxx" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-slate-900 placeholder:text-slate-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    {/* DITAMBAHKAN text-slate-900 dan placeholder:text-slate-400 */}
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="doctor@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-slate-900 placeholder:text-slate-400" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Jenis Kelamin</label>
                {/* DITAMBAHKAN text-slate-900 */}
                <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-900">
                  <option value="">Pilih</option>
                  <option value="Male">Laki-laki</option>
                  <option value="Female">Perempuan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tanggal Lahir</label>
                {/* DITAMBAHKAN text-slate-900 */}
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-900" />
              </div>
            </div>

            {role === 'dokter' && (
              <div className="pt-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Foto Profil</label>
                <div className="mt-1 border border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center hover:bg-slate-50 transition cursor-pointer relative bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <svg className="w-6 h-6 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <p className="text-xs text-slate-500 font-medium">{profileImage ? profileImage.name : 'Klik untuk upload foto profil'}</p>
                </div>
              </div>
            )}

            <div className={`grid grid-cols-1 ${role === 'dokter' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4 transition-all duration-500`}>
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <div className="relative">
                  {role === 'dokter' && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                  )}
                  {/* DITAMBAHKAN text-slate-900 dan placeholder:text-slate-400 */}
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Minimal 8 karakter" className={`w-full ${role === 'dokter' ? 'pl-10 pr-10' : 'px-4 pr-10'} py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-slate-900 placeholder:text-slate-400 tracking-widest`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {role === 'dokter' && (
                <div className="space-y-1 relative transition-all duration-500">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Konfirmasi Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    {/* DITAMBAHKAN text-slate-900 dan placeholder:text-slate-400 */}
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required={role === 'dokter'} placeholder="Ulangi password" className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-slate-900 placeholder:text-slate-400 tracking-widest" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-4">
              <button type="submit" disabled={isLoading} className="w-full bg-[#2064B7] hover:bg-[#1A539B] disabled:bg-blue-300 text-white font-bold py-3 rounded-lg transition shadow-md shadow-blue-100 tracking-wide flex justify-center items-center">
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Sign Up'}
              </button>

              {role === 'pasien' ? (
                <label className="flex items-center gap-2 cursor-pointer justify-center md:justify-start">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs font-medium text-slate-600 tracking-tight">Remember me</span>
                </label>
              ) : (
                <p className="text-center text-xs font-medium text-slate-500">
                  Sudah punya akun? <Link href="/login" className="text-blue-600 hover:underline">Login di sini</Link>
                </p>
              )}
            </div>

            {role === 'pasien' && (
              <div className="pt-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-slate-100"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Or sign up with</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button type="button" className="flex justify-center items-center py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm"><span className="text-xl">G</span></button>
                  <button type="button" className="flex justify-center items-center py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm text-blue-600 font-bold">f</button>
                  <button type="button" className="flex justify-center items-center py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm text-black text-xl"></button>
                </div>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}