// Mengimpor React beserta hooks pembuat konteks (createContext), useContext, useState, dan useCallback
import React, { createContext, useContext, useState, useCallback } from 'react';
// Mengimpor ikon-ikon dekoratif dari lucide-react untuk menunjukkan jenis/status toast
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

// Membuat objek Konteks Toast (ToastContext) global untuk manajemen notifikasi melayang
const ToastContext = createContext();

/**
 * Penyedia Konteks Notifikasi (ToastProvider) menyediakan wadah notifikasi terapung (toast)
 * di pojok kanan atas layar dan fungsi untuk memicu pemunculan toast dari modul mana saja.
 */
export function ToastProvider({ children }) {
  // State bertipe array untuk mengantrekan beberapa notifikasi toast yang sedang aktif tampil di layar
  const [toasts, setToasts] = useState([]);

  // Fungsi asinkron dibungkus useCallback untuk menambahkan toast baru ke dalam antrean/state
  const addToast = useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    // Membuat ID string acak unik untuk mengidentifikasi setiap item toast secara spesifik
    const id = Math.random().toString(36).substring(2, 9);
    // Menyisipkan objek konfigurasi toast baru ke akhir daftar antrean state
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
    
    // Menyetel timer otomatis untuk menghapus toast setelah durasi waktu (milidetik) yang ditentukan berlalu
    setTimeout(() => {
      // Panggil fungsi removeToast untuk menghapus toast berdasarkan ID-nya
      removeToast(id);
    }, duration);
  }, []); // Array dependensi kosong agar fungsi tidak dibuat ulang terus menerus

  // Fungsi dibungkus useCallback untuk menghapus secara manual atau otomatis item toast dari state
  const removeToast = useCallback((id) => {
    // Memfilter array toasts lokal untuk membuang item dengan ID terkait
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []); // Array dependensi kosong

  return (
    // Menyediakan fungsi pemicu 'toast' (yang diarahkan ke addToast) ke seluruh komponen anak
    <ToastContext.Provider value={{ toast: addToast }}>
      {/* Merender konten utama aplikasi */}
      {children}
      
      {/* Wadah Terapung Toast (Toast Container) di pojok kanan atas layar */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {/* Melakukan iterasi dan merender setiap data toast yang ada di antrean */}
        {toasts.map((t) => {
          // Set ikon default bertipe Info lingkaran biru
          let icon = <Info className="h-5 w-5 text-blue-500" />;
          // Set kelas CSS warna dasar putih/abu-abu transparan untuk mode gelap/terang
          let bgClass = 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700';
          
          // Jika tipe toast adalah sukses (success)
          if (t.variant === 'success') {
            // Set ikon centang hijau
            icon = <CheckCircle className="h-5 w-5 text-green-500" />;
            // Terapkan border hijau samar
            bgClass = 'bg-white/80 dark:bg-gray-800/80 border-green-200 dark:border-green-800/30';
          // Jika tipe toast adalah destruktif/error (destructive)
          } else if (t.variant === 'destructive') {
            // Set ikon lingkaran silang merah
            icon = <AlertCircle className="h-5 w-5 text-red-500" />;
            // Terapkan border merah samar
            bgClass = 'bg-white/80 dark:bg-gray-800/80 border-red-200 dark:border-red-800/30';
          // Jika tipe toast adalah peringatan (warning)
          } else if (t.variant === 'warning') {
            // Set ikon segitiga seru kuning
            icon = <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            // Terapkan border kuning samar
            bgClass = 'bg-white/80 dark:bg-gray-800/80 border-yellow-200 dark:border-yellow-800/30';
          }

          return (
            // Kotak tampilan fisik notifikasi toast dengan efek buram kaca (backdrop-blur)
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-x-0 animate-[fadeIn_0.2s_ease-out] ${bgClass}`}
            >
              {/* Tempat ikon penanda jenis toast */}
              <div className="flex-shrink-0 mt-0.5">{icon}</div>
              {/* Teks pesan informasi utama */}
              <div className="flex-grow">
                {/* Judul tebal toast */}
                {t.title && <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.title}</h4>}
                {/* Penjelasan subteks toast */}
                {t.description && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t.description}</p>}
              </div>
              {/* Tombol silang untuk menutup toast secara manual sebelum durasi berakhir */}
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// Hook kustom useToast agar mempermudah pemanggilan trigger toast di seluruh bagian aplikasi
export function useToast() {
  // Mengambil objek konteks toast
  const context = useContext(ToastContext);
  // Validasi: Cegah pemanggilan di luar pembungkus ToastProvider
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  // Mengembalikan data konteks toast
  return context;
}
