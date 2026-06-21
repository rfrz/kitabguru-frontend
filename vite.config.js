// Mengimpor fungsi pembantu defineConfig dari modul 'vite'
import { defineConfig } from 'vite'
// Mengimpor plugin react resmi untuk mengompilasi kode React (JSX) di Vite
import react from '@vitejs/plugin-react'
// Mengimpor modul path bawaan Node.js untuk manipulasi path folder/file
import path from "path"

// Mengeset konfigurasi build dan server web untuk perkakas Vite
export default defineConfig({
  // Menyertakan plugin react ke dalam daftar plugin Vite
  plugins: [react()],
  // Konfigurasi server pengembangan lokal
  server: {
    // Menetapkan port server pengembangan ke port 3000
    port: 3000,
    // Mengaktifkan host agar server mendengarkan di seluruh alamat IP lokal (untuk diakses perangkat lain)
    host: true,
  },
  // Konfigurasi resolusi path file impor
  resolve: {
    // Membuat alias impor agar folder './src' dapat diimpor langsung menggunakan simbol '@'
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
