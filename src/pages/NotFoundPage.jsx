// Mengimpor React untuk membangun komponen halaman
import React from 'react';
// Mengimpor Link dari router untuk navigasi kembali ke halaman home
import { Link } from 'react-router-dom';

/**
 * Halaman NotFoundPage bertindak sebagai layar 404 ketika pengguna mengakses
 * URL rute yang tidak terdaftar di dalam aplikasi.
 */
function NotFoundPage() {
  return (
    // Wadah pembungkus utama flexbox untuk memusatkan kartu 404 di tengah layar
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      {/* Kartu UI dialog 404 dengan efek bayangan dan border tipis */}
      <div className="max-w-md w-full text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-in">
        {/* Teks angka status 404 besar berwarna biru */}
        <h1 className="text-8xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">404</h1>
        {/* Subjudul pemberitahuan halaman tidak ditemukan */}
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">Page Not Found</h2>
        {/* Deskripsi penjelasan tambahan untuk user */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        {/* Tautan navigasi berupa tombol untuk kembali ke beranda depan (/) */}
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium text-sm transition-colors w-full justify-center"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

// Mengekspor komponen NotFoundPage agar dapat digunakan sebagai rute fallback
export default NotFoundPage;
