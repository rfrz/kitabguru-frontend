// Mengimpor modul utama React
import React from 'react'
// Mengimpor modul client ReactDOM untuk menghubungkan komponen React ke DOM browser
import ReactDOM from 'react-dom/client'
// Mengimpor komponen utama aplikasi (App)
import App from './App.jsx'
// Mengimpor file gaya CSS global (termasuk setelan Tailwind/layangan CSS)
import './index.css'

// Membuat akar (root) render di dalam elemen div ber-ID 'root' pada index.html, lalu jalankan render komponen
ReactDOM.createRoot(document.getElementById('root')).render(
  // Mengaktifkan mode ketat (StrictMode) React untuk membantu mendeteksi potensi masalah di penulisan kode
  <React.StrictMode>
    {/* Merender komponen utama aplikasi */}
    <App />
  </React.StrictMode>,
)
