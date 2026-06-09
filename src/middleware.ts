import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  // Untuk sekarang, kita loloskan semua akses tanpa pengecekan token
  return NextResponse.next();
}

// CONFIG MATCHER: Menentukan halaman mana saja yang harus dijaga oleh middleware
export const config = {
  matcher: [
    /*
     * Lindungi semua rute di dalam folder dashboard (pasien, dokter, admin)
     * Tambahkan rute lain jika diperlukan di masa mendatang.
     */
    '/dashboard/:path*',
  ],
};