'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  // State untuk mengontrol FAQ mana yang terbuka
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "Apa itu PVC dan mengapa penting untuk dideteksi?",
      answer: "PVC (Premature Ventricular Contractions) adalah denyut jantung ekstra yang dimulai di ventrikel. Deteksi dini PVC penting untuk mencegah komplikasi jantung yang lebih serius."
    },
    {
      question: "Seberapa akurat analisis AI?",
      answer: "Model AI kami menggunakan arsitektur deep learning yang dilatih dengan ribuan dataset ECG klinis, mencapai tingkat akurasi hingga 98.2% dalam mendeteksi anomali."
    },
    {
      question: "Berapa lama proses verifikasi dokter?",
      answer: "Setelah AI memproses data Anda, dokter spesialis kami akan memverifikasi hasilnya biasanya dalam waktu 1x24 jam hari kerja."
    },
    {
      question: "Apakah data saya aman?",
      answer: "Tentu. Data rekam medis dan informasi pribadi Anda dienkripsi secara end-to-end dan disimpan sesuai dengan standar keamanan dan privasi medis (HIPAA compliance)."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased overflow-x-hidden">
      {/* BEGIN: Header */}
      {/* <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10  rounded-full flex items-center justify-center">
                <img src="/LogoPVC.png" alt="PVCare Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-gray-900">PVCare</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-primary-hover font-medium transition">Features</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-primary-hover font-medium transition">How it Works</Link>
              <Link href="#faq" className="text-gray-600 hover:text-primary-hover font-medium transition">FAQ</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-primary font-medium px-5 py-2.5 border border-primary rounded-full hover:bg-primary/5 transition">
                Login
              </Link>
              <Link href="/register" className="bg-primary text-white font-medium px-6 py-2.5 rounded-full hover:bg-primary-hover transition shadow-md shadow-primary/20">
                Mulai
              </Link>
            </div>
          </div>
        </div>
      </header> */}
<header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10  rounded-full flex items-center justify-center">
                <img src="/LogoPVC.png" alt="PVCare Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-gray-900">PVCare</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-500 font-medium transition">Features</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-500 font-medium transition">How it Works</Link>
              <Link href="#faq" className="text-gray-600 hover:text-blue-500 font-medium transition">FAQ</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-blue-500 font-medium px-4 py-2 border border-blue-500 rounded-full hover:bg-blue-50 transition">
                Login
              </Link>
              <Link href="/register" className="bg-blue-500 text-white font-medium px-6 py-2 rounded-full hover:bg-blue-600 transition shadow-md shadow-blue-500/20">
                Mulai
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* END: Header */}

      {/* BEGIN: Hero Section */}
      <section className="pt-32 pb-0 lg:pt-40 bg-[#F8FAFC] overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative w-full">
            
            {/* Animate Hero Text */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="text-left py-20 relative z-10 max-w-xl lg:max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
                Deteksi PVC Jantung dengan <br />
                <span className="text-primary bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">Teknologi AI</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-lg">
                Dapatkan analisis PVC (Premature Ventricular Contractions) yang akurat dengan AI, diverifikasi oleh dokter profesional
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="bg-primary text-white font-medium px-8 py-3.5 rounded-full hover:bg-primary-hover transition shadow-lg shadow-primary/30">
                  Coba sekarang?
                </Link>
                <Link href="/register" className="text-primary bg-white font-medium px-8 py-3.5 border border-primary rounded-full hover:bg-primary/5 transition">
                  Daftar sebagai dokter
                </Link>
              </div>
            </motion.div>

            {/* Animate Hero Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
              className="absolute right-0 bottom-0 top-0 z-0 flex items-center justify-end pointer-events-none"
            >
              <img 
                src="/pictureDokterBG.png"
                alt="Doctor with AI technology" 
                className="h-full w-auto object-contain opacity-20 lg:opacity-85 max-h-[400px] lg:max-h-[550px] translate-y-8 lg:translate-y-16" 
              />
            </motion.div>
          </div>
        </div>
      </section>
      {/* END: Hero Section */}

      {/* BEGIN: Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Animate Section Title */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Fitur Unggulan.</h2>
            <p className="text-gray-600">
              Dilengkapi dengan berbagai fitur mutakhir untuk memastikan analisis jantung Anda cepat, akurat, dan terpercaya. Integrasi antara Kecerdasan Buatan dan validasi medis profesional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI Analysis',
                desc: 'Analisis PVC otomatis menggunakan deep learning dengan akurasi tinggi',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: 'Doctor Verification',
                desc: 'Verifikasi hasil AI oleh dokter spesialis jantung bersertifikat',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: 'Riwayat Pemeriksaan',
                desc: 'Lacak semua pemeriksaan dan hasil verifikasi dalam satu dashboard',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: 'ECG Processing',
                desc: 'Proses data ECG secara real-time dengan visualisasi interaktif',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )
              }
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
                className="bg-accent border border-blue-200/50 rounded-2xl p-6 text-center hover:shadow-lg transition duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 text-primary rounded-full flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{feat.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* END: Features Section */}

      {/* BEGIN: How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Checklist */}
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-3xl md:text-4xl font-bold mb-10 text-gray-900"
              >
                Bagaimana Cara Kerjanya?
              </motion.h2>
              <div className="space-y-4">
                {[
                  { num: 1, title: 'Upload Data ECG', desc: 'Upload file ECG Anda dalam format CSV atau gambar yang didukung.' },
                  { num: 2, title: 'AI Processing', desc: 'Sistem AI kami akan mengekstraksi dan menganalisis gelombang jantung Anda.' },
                  { num: 3, title: 'Doctor Verification', desc: 'Hasil AI akan ditinjau dan divalidasi oleh dokter spesialis pilihan.' },
                  { num: 4, title: 'See the results', desc: 'Dapatkan laporan komprehensif beserta catatan medis dari dokter.' }
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                    className="bg-white p-6 rounded-xl border border-gray-200 flex items-start gap-4 shadow-sm hover:border-primary transition duration-300"
                  >
                    <div className="w-10 h-10 shrink-0 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-gray-900">{step.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Showcase Image */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-auto flex gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <img 
                  alt="Doctor holding heart" 
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4cmVR9AeOMUfSCVckZ09l_v2QSyuALjHCjI6kvNX8tCAjC55rI7CUCHUtxtjUoiBt-4OZNgD2gHZKRBQi_lP3cUAxI92m7uxBeDylq0lq4EDATkbuKMm1B8i3ouHYGHPTQqTEN8kByceXHG28cH2nofFRiytHJsJ4ax0f6ZKo9vxyD3J8CVtTp8oShjhI7eMB8uPIEQa5j8oWHN-BpBXV98zL7HqyEkgY_rN1ipSWR0hAbrPfVSQmmPVpwBA23x8YhArVnZvqLjnb" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* END: How It Works */}

      {/* BEGIN: Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Verifikasi Oleh Dokter Terpercaya</h2>
            <p className="text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
              Setiap hasil AI diverifikasi oleh dokter spesialis jantung yang telah tersertifikasi dan berpengalaman untuk memastikan Anda mendapatkan perawatan terbaik.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                num: "25+",
                label: "Dokter Spesialis Terverifikasi",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                num: "2,500+",
                label: "Pasien Telah Dilayani",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                num: "98%",
                label: "Tingkat Kepuasan Pengguna",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514C5.024 10 5 9.5 5 9c0-.828.672-1.5 1.5-1.5z" />
                  </svg>
                )
              }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
                className="flex flex-col items-center p-6 rounded-2xl hover:bg-gray-50 transition duration-300"
              >
                <div className="w-16 h-16 text-primary mb-4 bg-accent rounded-full flex items-center justify-center">
                  {stat.icon}
                </div>
                <p className="text-gray-800 font-bold text-2xl mb-2">{stat.num}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* END: Trust Section */}

      {/* BEGIN: Our Doctors */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Dokter Kami
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Michael Olise, Sp.JP, FIHA",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-E5m7kd41ATDOS5Rh6QlWnr4OPq8Xrczv9seqNanyhV0pJ0MCdOluKrE2pPrGIseECyNAkcMhaVhbUX7lIsHi84hwr8txvLY7Cfhtf-qI4thSIbYUSaRyTBa_HuGB2SlNrkO_BPGgv77-q896uozbNGfrbd_l3oFlBUhilsRtkOSb9fEYbJpyUMUN8A5KgvHxBWDFUtpUX82WJfitrZDexTSYt8a5W0plJaENun-_V9mD0ImyvEKHaFGhC9b1uCPKAYJtuAbOVgXP"
              },
              {
                name: "Alessia Russo, Sp.JP, FIHA",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAK-fcl2uUlEuHZf5lxqx1gEaV9deMsyjxRjamzVKEeV5GO0aoDFG_qkAHspVf5p-glixDzRnfT1Ej6L_d99PSonqAmDnVWizHSCfs6LL45tT0UXaOOkNtSrvdEGhL6HAWWNMNmwN7SJMyzncylAYCLffluEjScqkm6behUBmNMz3nHrQigi39d5uTAgsyQNZsXDa4lrdwX0QxyxX0LktGAK3rbjC2ZsrDS6Vh8vEu-2dJdCjoR75gYA4ShjYodEyXArquG4JNz_sik"
              },
              {
                name: "Aitana Bonmati, Sp.JP, FIHA",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJC9MYw6seJnSP8Gi0jg-9Zyx7SQ24FZsVTIufx2P-burqWSidgUD8wWuKPrPNKgIljWVeJAL1YX_4ogtifAix6wMPYE3vx6LDg6vvWopNHxOmIKagdYTEe2DwNWGXvsj9cruTN6TgfG_UOKxxpWLz8lWffdnEng2R3Fb1JfeyR3GoOozKzgtsedjowrRJpemiccgH_-8WmqCe1r1lHzuLJ2RZQ0G4XMvBleb9aHvz_1jo7WQmZoVWzMaCHUlbU0y8GQuq5sjrfRxV"
              },
              {
                name: "Joshua Kimmich, Sp.JP, FIHA",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1KSPifVQ4pZGntnypIjj_Cr7CKFyfmSunaYovV87iRYuUgpWDQlXET55wiLB8ZVCWaOBo62jsv8xq89WStL7qQo4QydfzmSFhsPDMSl42_bvKm-_LzUzxc4L1nhel0FJ4cn2ABzRo_SvRehtOoKoCm8A6zO4dXgYsH_TTXffMDuxk583pHvpBzEYDwugcoR61t3pPBR_Hsn7Kiz9_AAdvGRP2mcBxauTxFLQ4Hq0bVyalzUVbjGySX4acwmIs6gKw1gDouQqg3w3a"
              }
            ].map((doc, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                <img alt={doc.name} className="w-full h-64 object-cover object-top" src={doc.img} />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1 text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    <span className="font-semibold text-primary">Spesialisasi:</span> Cardiology
                  </p>
                  <Link href="/register" className="mt-auto text-primary font-semibold flex items-center hover:text-primary-hover transition">
                    More Info 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* END: Our Doctors */}

      {/* BEGIN: FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
          >
            FAQ
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200 bg-white"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 bg-white text-left focus:outline-none hover:bg-gray-50 transition-colors"
                >
                  <span className={`font-semibold text-lg transition-colors duration-200 ${openFaq === index ? 'text-primary' : 'text-gray-700'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${openFaq === index ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <svg 
                      className={`w-5 h-5 transform transition-transform duration-200 ${openFaq === index ? 'rotate-90' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="p-6 pt-0 text-gray-600 bg-white border-t border-gray-100 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* END: FAQ */}

      {/* BEGIN: Footer */}
      <footer className="bg-primary-dark text-white pt-16 pb-8 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                <img src="/LogoPVC.png" alt="PVCare Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-3xl font-bold leading-none tracking-tight">PVCare</span>
                <p className="text-sm text-blue-100 font-medium tracking-wide">for your health</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <Link href="#features" className="hover:text-blue-200 transition">Layanan</Link>
              <Link href="#" className="hover:text-blue-200 transition">Tentang Kami</Link>
              <Link href="#how-it-works" className="hover:text-blue-200 transition">Deteksi</Link>
              <Link href="#" className="hover:text-blue-200 transition">Dokter</Link>
              <Link href="#" className="hover:text-blue-200 transition">Kontak</Link>
            </div>
          </div>
          <div className="border-t border-blue-400/30 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-100">
            <p>© {new Date().getFullYear()} Humic Engineering. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </div>
  );
}