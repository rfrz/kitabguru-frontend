// Mengimpor React untuk membuat komponen berbasis kelas (class component)
import React from 'react';

/**
 * Komponen ErrorBoundary menangkap kesalahan JavaScript di mana saja dalam pohon komponen anak,
 * mencatat kesalahan tersebut, dan menampilkan UI fallback sebagai pengganti komponen yang rusak.
 */
class ErrorBoundary extends React.Component {
  // Konstruktor untuk menginisialisasi state awal komponen pembatas error
  constructor(props) {
    // Memanggil konstruktor kelas induk React.Component
    super(props);
    // Menginisialisasi state: melacak apakah terjadi error, detail error, dan info tumpukan pemanggilan (callstack)
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Hook static yang dipanggil setelah kesalahan dilemparkan oleh komponen anak
  static getDerivedStateFromError(error) {
    // Memperbarui state sehingga render berikutnya akan menampilkan UI fallback
    return { hasError: true };
  }

  // Hook siklus hidup yang dipanggil setelah kesalahan ditangkap untuk melakukan efek samping
  componentDidCatch(error, errorInfo) {
    // Menyimpan objek kesalahan dan informasi tumpukan pemanggilan ke state lokal
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Mencatat log kesalahan ke konsol browser untuk keperluan debugging
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  // Fungsi untuk memuat ulang halaman secara paksa guna memulihkan aplikasi dari error
  handleReload = () => {
    // Memanggil fungsi reload bawaan browser pada objek window
    window.location.reload();
  };

  // Merender UI berdasarkan status error saat ini
  render() {
    // Jika state mendeteksi adanya error yang tertangkap
    if (this.state.hasError) {
      return (
        // Area pembungkus utama dengan flexbox untuk menempatkan kartu error di tengah layar
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          {/* Kartu UI dialog error dengan bayangan dan transisi masuk */}
          <div className="max-w-md w-full text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-in">
            {/* Lingkaran merah penampung ikon peringatan (warning) */}
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* Ikon peringatan SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            
            {/* Judul utama pesan error */}
            <h1 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">Oops! Something went wrong.</h1>
            {/* Subteks deskripsi singkat error */}
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              An unexpected error has occurred and the page could not be displayed.
            </p>

            {/* Menampilkan kotak detail teknis error secara kondisional jika objek error tersedia */}
            {this.state.error && (
              // Kotak scroll teks kode mono berwarna merah untuk log error literal
              <div className="text-left mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-800 max-h-40 overflow-y-auto text-xs text-red-500 font-mono">
                {/* Konversi objek error menjadi string teks */}
                {this.state.error.toString()}
              </div>
            )}

            {/* Tombol interaktif untuk memuat ulang halaman */}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium text-sm transition-colors w-full justify-center"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // Jika tidak ada kesalahan yang ditangkap, render elemen anak (children) normal apa adanya
    return this.props.children;
  }
}

// Mengekspor komponen ErrorBoundary secara default agar dapat digunakan membungkus aplikasi
export default ErrorBoundary;
