// Mengimpor React beserta hooks inti (createContext, useContext, useEffect, useState)
import React, { createContext, useContext, useEffect, useState } from 'react';

// Membuat objek Konteks Tema (ThemeContext) global untuk kontrol dark/light mode
const ThemeContext = createContext();

/**
 * Penyedia Konteks Tema (ThemeProvider) mendeteksi preferensi tema pengguna,
 * memperbarui class 'dark' pada elemen root HTML, dan menyimpan pilihan tema di localStorage.
 */
export function ThemeProvider({ children }) {
  // State untuk menyimpan tema terpilih, diinisialisasi dari localStorage atau default ke 'system'
  const [theme, setTheme] = useState(() => {
    // Membaca nilai item 'theme' dari penyimpanan lokal browser
    return localStorage.getItem('theme') || 'system';
  });

  // Efek samping untuk menerapkan class CSS tema pada elemen root dokumen setiap kali tema berubah
  useEffect(() => {
    // Mengambil elemen akar (root/html) dari dokumen halaman web
    const root = window.document.documentElement;
    
    // Fungsi internal untuk mengaplikasikan tema gelap atau terang secara dinamis
    const applyTheme = () => {
      // Periksa apakah tema diset 'dark', atau diset 'system' dengan preferensi OS bertipe dark-mode
      if (
        theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        // Tambahkan kelas CSS 'dark' pada elemen html untuk memicu styling Tailwind/CSS dark-mode
        root.classList.add('dark');
      } else {
        // Hapus kelas CSS 'dark' agar kembali ke mode terang (light-mode)
        root.classList.remove('dark');
      }
    };

    // Jalankan fungsi pengaplikasian tema
    applyTheme();
    // Simpan pilihan tema saat ini ke penyimpanan lokal browser agar bertahan saat refresh halaman
    localStorage.setItem('theme', theme);

    // Jika tema diset mengikuti sistem operasi (system)
    if (theme === 'system') {
      // Daftarkan listener ke preferensi skema warna sistem operasi
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      // Membuat fungsi penanganan saat preferensi sistem operasi berubah (misal otomatis berganti malam hari)
      const handleChange = () => applyTheme();
      // Tambahkan event listener pemantau perubahan
      mediaQuery.addEventListener('change', handleChange);
      // Bersihkan listener saat komponen di-unmount atau tema diubah ke non-system
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]); // Efek ini dijalankan ulang setiap kali state theme diperbarui

  // Fungsi untuk mengganti tema bergantian dari light -> dark -> system -> light
  const toggleTheme = () => {
    // Memperbarui state tema secara berputar
    setTheme((prev) => {
      // Jika tema saat ini light, ganti ke dark
      if (prev === 'light') return 'dark';
      // Jika tema saat ini dark, ganti ke system
      if (prev === 'dark') return 'system';
      // Default ganti kembali ke light
      return 'light';
    });
  };

  return (
    // Menyediakan status tema saat ini dan fungsi pengubah tema ke seluruh komponen aplikasi
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook kustom useTheme agar mempermudah komponen lain mengakses status dan fungsi pengubah tema
export function useTheme() {
  // Mengambil instance konteks tema aktif
  const context = useContext(ThemeContext);
  // Validasi: Jika pemanggilan useTheme berada di luar lingkup ThemeProvider, lempar error
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  // Mengembalikan data konteks tema
  return context;
}
