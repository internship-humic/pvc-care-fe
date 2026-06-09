'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  // State untuk interaktivitas FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      
      {/* 1. NAVBAR (Proporsional sesuai Gambar Desain) */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-200">
              ♥
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">PVCare</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How it works</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-6 py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition">
              Login
            </Link>
            <Link href="/register" className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:opacity-90 shadow-sm transition">
              Mulai
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Dengan Animasi Framer Motion) */}
      <header className="pt-36 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-hidden">
        
        {/* Konten Teks (Muncul dari kiri) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-7 space-y-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Deteksi PVC Jantung dengan <br />
            <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Teknologi AI</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
            Dapatkan analisis PVC (Premature Ventricular Contractions) yang akurat dengan AI, diverifikasi oleh dokter profesional.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/register" className="bg-blue-600 text-white px-7 py-3.5 rounded-full font-medium hover:bg-blue-700 transition shadow-md shadow-blue-100">
              Coba sekarang?
            </Link>
            <Link href="/register" className="border border-blue-200 text-blue-600 px-7 py-3.5 rounded-full font-medium hover:bg-blue-50 transition">
              Daftar sebagai dokter
            </Link>
          </div>
        </motion.div>

        {/* Konten Gambar (Muncul dari kanan) */}
        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full max-w-md">
            <img className="w-full h-full object-cover" src="https://placehold.co/760x576" alt="Dokter PVCare" />
          </div>
        </motion.div>
      </header>

      {/* ==================== 3. FITUR UNGGULAN SECTION (Scroll Animation) ==================== */}
      <section id="features" className="py-24 bg-white px-6 max-w-7xl mx-auto border-t border-slate-100 overflow-hidden">
        
        {/* Animasi Judul Fitur */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Fitur Unggulan.</h2>
          <p className="text-base text-slate-500 leading-relaxed">
            Dilengkapi dengan berbagai fitur unggulan. Condimentum sit nunc in eros scelerisque sed. Commodo in viverra nunc, ullamcorper ut. Non, amet, aliquet scelerisque nullam sagittis, pulvinar.
          </p>
        </motion.div>

        {/* Animasi Grid Kartu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'AI Analysis', desc: 'Analisis PVC otomatis menggunakan deep learning dengan akurasi tinggi', icon: '🧠' },
            { title: 'Doctor Verification', desc: 'Verifikasi hasil AI oleh dokter spesialis jantung bersertifikat', icon: '🧑‍⚕️' },
            { title: 'Riwayat Pemeriksaan', desc: 'Lacak semua pemeriksaan dan hasil verifikasi dalam satu dashboard', icon: '📊' },
            { title: 'ECG Processing', desc: 'Proses data ECG secara real-time dengan visualisasi interaktif', icon: '🔄' },
          ].map((feat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }} // Delay dinamis berdasarkan index (0.15s, 0.30s, dst)
              // className="p-8 bg-blue-50/40 border border-blue-100 rounded-2xl flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 hover:shadow-md hover:border-blue-200 transition duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">{feat.icon}</div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (Penataan Angka Bulat Sesuai Gambar) */}
      <section id="how-it-works" className="py-24 bg-white px-6 max-w-7xl mx-auto border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 space-y-8">
          {/* Animasi Judul Fitur */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-20"
          >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Bagaimana Cara Kerjanya?</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { num: 1, title: 'Upload Data ECG', desc: 'Upload file ECG Anda dalam format yang didukung.' },
              { num: 2, title: 'AI Processing', desc: 'AI kami akan menganalisis data ECG dan mendeteksi PVC.' },
              { num: 3, title: 'Doctor Verification', desc: 'Pilih dokter untuk verifikasi hasil.' },
              { num: 4, title: 'See the results', desc: 'Lihat hasil pemeriksaan.' },
            ].map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }} // Delay dinamis berdasarkan index (0.15s, 0.30s, dst)
                // className="p-8 bg-blue-50/40 border border-blue-100 rounded-2xl flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 hover:shadow-md hover:border-blue-200 transition duration-300"
              >
              <div key={step.num} className="flex items-start gap-5 p-4 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition duration-200">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm shadow-blue-200">
                  {step.num}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-normal">{step.desc}</p>
                </div>
              </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-md flex flex-col">
              <div className="p-4 bg-slate-100/50 border-b border-slate-100 flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              </div>
              <img className="w-full aspect-[600/364] object-cover" src="https://placehold.co/600x364" alt="Ilustrasi Monitoring" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. VERIFIKASI DOKTER TRUST SECTION (3 Poin Center Sesuai Gambar) */}
      <section className="py-24 bg-white px-6 max-w-7xl mx-auto border-t border-slate-100 text-center space-y-16">
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* Animasi Judul Fitur */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-20"
          > 
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Verifikasi Oleh Dokter Terpercaya</h2>
          <p className="text-base text-slate-500">Setiap hasil AI diverifikasi oleh dokter spesialis jantung yang telah tersertifikasi dan berpengalaman</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            { label: 'Kami memiliki lebih dari 25 dokter terverifikasi.', icon: '🩺' },
            { label: 'Dokter telah melayani lebih dari 2500 pasien.', icon: '📈' },
            { label: 'Tingkat kepuasan 95%.', icon: '✨' },
          ].map((stat, idx) => (
            <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }} // Delay dinamis berdasarkan index (0.15s, 0.30s, dst)
                // className="p-8 bg-blue-50/40 border border-blue-100 rounded-2xl flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 hover:shadow-md hover:border-blue-200 transition duration-300"
            >
                <div key={idx} className="flex flex-col items-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl shadow-sm">{stat.icon}</div>
                  <p className="text-base font-semibold text-slate-700 max-w-[240px] leading-relaxed">{stat.label}</p>
                </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. TIM DOKTER CARD SECTION (Slicing Kartu Rapi Sesuai Gambar) */}
      <section className="py-24 bg-white px-6 max-w-7xl mx-auto border-t border-slate-100 space-y-16">
        {/* Animasi Judul Fitur */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-20"
          > 
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center tracking-tight">Dokter Kami</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'Michael Olise, Sp.JP, FIHA',
            'Alessia Russo, Sp.JP, FIHA',
            'Aitana Bonmati, Sp.JP, FIHA',
            'Joshua Kimmich, Sp.JP, FIHA'
          ].map((name, idx) => (
            <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }} // Delay dinamis berdasarkan index (0.15s, 0.30s, dst)
                // className="p-8 bg-blue-50/40 border border-blue-100 rounded-2xl flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 hover:shadow-md hover:border-blue-200 transition duration-300"
            >
              <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 bg-white flex flex-col h-full">
                <div className="bg-slate-100 aspect-[4/3] w-full flex items-center justify-center text-slate-400">
                  <img className="w-full h-full object-cover" src="https://placehold.co/308x220" alt={name} />
                </div>
                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{name}</h3>
                    <p className="text-xs text-blue-600 bg-blue-50/80 inline-block px-2.5 py-1 rounded-md font-semibold">Spesialisasi: Cardiology</p>
                  </div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 text-left flex items-center gap-1.5 transition pt-2 border-t border-slate-50">
                    More Info <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. FAQ ACCORDION SECTION (Rapi, Sesuai Bentuk Gambar Berbayang) */}
      <section id="faq" className="py-24 bg-white px-6 max-w-4xl mx-auto border-t border-slate-100 space-y-16">
        {/* Animasi Judul Fitur */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-20"
        > 
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center tracking-tight">FAQ</h2>
        </motion.div>
        
        <div className="space-y-4">
          {[
            { q: 'Apa itu PVC dan mengapa penting untuk dideteksi?', a: 'PVC (Premature Ventricular Contractions) adalah denyut jantung ekstra yang dimulai di ventrikel. Deteksi dini PVC penting untuk mencegah komplikasi jantung yang lebih serius.' },
            { q: 'Seberapa akurat analisis AI?', a: 'Sistem kecerdasan buatan dikembangkan dengan akurasi tinggi, namun konfirmasi akhir serta keputusan medis tetap mutlak divalidasi oleh dokter spesialis.' },
            { q: 'Berapa lama proses verifikasi dokter?', a: 'Rata-rata proses pembacaan dan penyusunan catatan medis dari pihak kardiolog selesai dalam kurun waktu kurang dari 24 jam.' },
            { q: 'Apakah data saya aman?', a: 'Seluruh riwayat rekam ECG dan data pengguna dijamin aman menggunakan proteksi database berlapis demi menjaga hak privasi medis.' },
          ].map((faq, idx) => (
            <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }} // Delay dinamis berdasarkan index (0.15s, 0.30s, dst)
                // className="p-8 bg-blue-50/40 border border-blue-100 rounded-2xl flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 hover:shadow-md hover:border-blue-200 transition duration-300"
            >
            <div key={idx} className="border border-slate-200/80 rounded-2xl overflow-hidden transition bg-white shadow-[0_4px_12px_rgba(24,32,60,0.04)]">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left font-bold text-base text-slate-900 flex items-center justify-between gap-6 hover:bg-slate-50/50 transition"
              >
                <span>{faq.q}</span>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${openFaq === idx ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'}`}>
                  ▼
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4 bg-slate-50/20">
                  {faq.a}
                </div>
              )}
            </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER (Warna Biru Full Lebar Menawan Sesuai Gambar) */}
      <footer className="bg-blue-600 text-white pt-16 pb-8 px-6 border-t border-blue-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-blue-500 pb-12 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-base shadow-sm">♥</div>
              <span className="text-xl font-bold tracking-tight">PVCare</span>
            </div>
            <p className="text-xs text-blue-100 opacity-80 pl-9">for your health</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-blue-100">
            <a href="#" className="hover:text-white transition">Layanan</a>
            <a href="#" className="hover:text-white transition">Tentang Kami</a>
            <a href="#how-it-works" className="hover:text-white transition">Deteksi</a>
            <a href="#" className="hover:text-white transition">Dokter</a>
            <a href="#" className="hover:text-white transition">Kontak</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-blue-100">
          <p>Humic Engineering &copy; {new Date().getFullYear()} PVCare. All rights reserved.</p>
          <div className="flex gap-5 text-base opacity-90 bg-white/10 p-2 rounded-xl">
            <span className="cursor-pointer hover:opacity-100 transition">🌐</span>
            <span className="cursor-pointer hover:opacity-100 transition">📷</span>
            <span className="cursor-pointer hover:opacity-100 transition">🐦</span>
            <span className="cursor-pointer hover:opacity-100 transition">💼</span>
          </div>
        </div>
      </footer>

    </div>
  );
}