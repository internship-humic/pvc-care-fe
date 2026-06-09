'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Posisi awal sebelum halaman muncul (transparan & agak ke bawah)
      animate={{ opacity: 1, y: 0 }}  // Posisi saat halaman muncul penuh (jelas & pas di tengah)
      transition={{ ease: 'easeInOut', duration: 0.5 }} // Kecepatan dan kelancaran animasi
    >
      {children}
    </motion.div>
  );
}