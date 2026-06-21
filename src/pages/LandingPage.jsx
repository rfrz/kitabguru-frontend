// Mengimpor React untuk membangun komponen landing page
import React from 'react';
// Mengimpor Link dari react-router-dom untuk navigasi antar halaman tanpa me-reload browser
import { Link } from 'react-router-dom';
// Mengimpor hook useAuth untuk mendeteksi apakah pengguna sudah dalam posisi login
import { useAuth } from '../contexts/AuthContext';
// Mengimpor ikon-ikon dari lucide-react untuk mempercantik visual tampilan
import { 
  MessageSquare, 
  Image as ImageIcon,
  Film,
  ArrowRight, 
  BookOpen, 
  Zap 
} from 'lucide-react';

/**
 * Halaman Landing (LandingPage) merupakan beranda depan aplikasi KitabGuru.
 * Menjelaskan fitur-fitur platform (Chat, Image Generator, Video Script Generator)
 * serta mengarahkan user untuk mendaftar atau masuk ke sistem obrolan.
 */
export default function LandingPage() {
  // Mengambil objek data user dari konteks autentikasi
  const { user } = useAuth();

  return (
    // Wadah utama halaman web dengan latar belakang responsif (mode gelap/terang)
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Bagian Bar Navigasi Atas (Header) */}
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo KitabGuru berupa link rute menuju beranda */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {/* Ikon buku terbuka */}
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            {/* Teks logo dengan gradasi warna premium */}
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              KitabGuru
            </span>
          </Link>
          
          {/* Area Menu Navigasi Kanan */}
          <div className="flex items-center gap-4">
            {/* Jika user sudah login, tampilkan tombol langsung masuk ke chat */}
            {user ? (
              <Link 
                to="/chat" 
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm transition-colors"
              >
                Start Chatting
              </Link>
            ) : (
              // Jika user belum login, tampilkan opsi masuk (Sign In) dan daftar (Get Started)
              <>
                {/* Link masuk */}
                <Link to="/login" className="text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
                {/* Tombol daftar */}
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Bagian Hero (Sapaan Utama / Promosi Pertama) */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
        {/* Pola grid latar belakang (efek visual estetik) */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge penanda fitur dengan animasi denyut (pulse) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30 mb-6 animate-pulse">
            <Zap size={14} /> Fitur AI Generatif Khusus Pelajar
          </div>
          {/* Judul utama hero dengan teks gradasi */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Asisten AI Cerdas untuk Pelajar:{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Chat, Image & Video Generator
            </span>
          </h1>
          {/* Deskripsi paragraf ringkasan fungsi aplikasi */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            KitabGuru menggabungkan kekuatan AI untuk menjawab pertanyaan dari kitab, menghasilkan ilustrasi edukatif, dan menyusun skrip video secara instan.
          </p>
          {/* Tombol aksi utama (Call to Action) */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {/* Arahkan langsung ke chat jika user sudah terautentikasi */}
            {user ? (
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-md transition-all group"
              >
                Start Chatting <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              // Tampilkan tombol daftar akun baru dan tombol demo jika tamu
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-md transition-all group"
                >
                  Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                >
                  Watch Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Bagian Grid Fitur (Features Section) */}
      <section className="py-20 sm:py-28 bg-gray-50/50 dark:bg-gray-900/30 border-y border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header deskripsi fitur */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Semua yang Anda butuhkan untuk belajar</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              Jelajahi berbagai fitur AI yang dirancang untuk mempercepat dan memperkaya proses pembelajaran Anda.
            </p>
          </div>

          {/* Grid kartu-kartu fitur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kartu Fitur 1: Chat Kitab RAG */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 hover:shadow-lg transition-shadow">
              {/* Wadah ikon biru */}
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-5">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Chat Kitab</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                Tanyakan apa saja seputar kitab dan dapatkan jawaban akurat beserta referensi halaman dan cuplikan teks aslinya secara langsung.
              </p>
            </div>

            {/* Kartu Fitur 2: Image Generator */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 hover:shadow-lg transition-shadow">
              {/* Wadah ikon indigo */}
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-5">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Image Generator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                Hasilkan ilustrasi visual yang menakjubkan dari deskripsi teks untuk membantu visualisasi materi pembelajaran Anda.
              </p>
            </div>

            {/* Kartu Fitur 3: Video Script Generator */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 hover:shadow-lg transition-shadow">
              {/* Wadah ikon ungu */}
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center mb-5">
                <Film className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Video Script Gen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                Buat skrip video edukatif terstruktur secara otomatis hanya dengan memberikan topik yang ingin Anda bahas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Kaki Halaman (Footer) */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo Footer */}
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <span className="font-semibold text-sm">KitabGuru</span>
          </div>
          {/* Hak Cipta Tahun Dinamis */}
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} KitabGuru. All rights reserved.
          </p>
          {/* Tautan Informasi Hukum/Kontak */}
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
