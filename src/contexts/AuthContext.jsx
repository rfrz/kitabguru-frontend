// Mengimpor React beserta fungsi pembuat konteks (createContext), hooks useContext, useState, dan useEffect
import React, { createContext, useContext, useState, useEffect } from 'react';
// Mengimpor API otentikasi (authApi) untuk melakukan request ke backend
import { authApi } from '../api/auth';
// Mengimpor client HTTP (apiClient) untuk akses endpoint data pengguna
import { apiClient } from '../api/client';

// Membuat objek Konteks Autentikasi (AuthContext) baru dengan nilai default null
const AuthContext = createContext(null);

/**
 * Penyedia Konteks Autentikasi (AuthProvider) membungkus aplikasi agar state user,
 * fungsi login, register, dan logout dapat diakses oleh seluruh halaman anak.
 */
export const AuthProvider = ({ children }) => {
  // State untuk menyimpan data profil pengguna yang sedang login (null jika tamu)
  const [user, setUser] = useState(null);
  // State untuk melacak status pemuatan awal autentikasi (misal saat membaca token lokal)
  const [isLoading, setIsLoading] = useState(true);

  // Efek samping untuk memeriksa token akses saat aplikasi pertama kali dimuat di browser
  useEffect(() => {
    // Fungsi asinkron untuk mengambil data profil user aktif berdasarkan token tersimpan
    const fetchUser = async () => {
      // Mengambil token akses JWT dari penyimpanan lokal browser
      const token = localStorage.getItem('access_token');
      // Jika token akses ditemukan
      if (token) {
        try {
          // Melakukan request GET ke endpoint profil diri (/users/me)
          const { data } = await apiClient.get('/users/me');
          // Menyimpan objek data profil user ke dalam state
          setUser(data);
        } catch (error) {
          // Cetak error ke konsol jika request gagal atau token kadaluwarsa
          console.error("Failed to fetch user:", error);
          // Hapus token akses yang tidak valid dari penyimpanan lokal browser
          localStorage.removeItem('access_token');
          // Hapus token refresh dari penyimpanan lokal browser
          localStorage.removeItem('refresh_token');
        }
      }
      // Set status loading autentikasi selesai (false)
      setIsLoading(false);
    };
    // Panggil fungsi asinkron fetchUser
    fetchUser();
  }, []); // Array dependensi kosong menjamin efek ini hanya dijalankan sekali ketika di-mount

  // Fungsi asinkron untuk masuk (login) menggunakan email dan kata sandi
  const login = async (email, password) => {
    // Melakukan request API login asinkron
    const data = await authApi.login({ email, password });
    // Menyimpan token akses baru hasil login ke penyimpanan lokal browser
    localStorage.setItem('access_token', data.access_token);
    // Menyimpan token refresh baru hasil login ke penyimpanan lokal browser
    localStorage.setItem('refresh_token', data.refresh_token);
    // Menyimpan objek profil user hasil login ke state global
    setUser(data.user);
    // Mengembalikan objek profil user
    return data.user;
  };

  // Fungsi asinkron untuk mendaftarkan akun baru (register)
  const register = async (email, username, password) => {
    // Melakukan request API pendaftaran akun baru asinkron
    const data = await authApi.register({ email, username, password });
    // Menyimpan token akses baru hasil registrasi ke penyimpanan lokal browser
    localStorage.setItem('access_token', data.access_token);
    // Menyimpan token refresh baru hasil registrasi ke penyimpanan lokal browser
    localStorage.setItem('refresh_token', data.refresh_token);
    // Menyimpan profil user baru yang masuk otomatis ke state global
    setUser(data.user);
    // Mengembalikan data profil user
    return data.user;
  };

  // Fungsi asinkron untuk keluar (logout) dari aplikasi
  const logout = async () => {
    // Mengambil token refresh dari penyimpanan lokal browser
    const refreshToken = localStorage.getItem('refresh_token');
    // Jika token refresh ada
    if (refreshToken) {
      try {
        // Melakukan request ke server untuk mematikan token refresh aktif tersebut
        await authApi.logout(refreshToken);
      } catch (error) {
        // Tampilkan error ke konsol jika request pembatalan token gagal di backend
        console.error("Logout error:", error);
      }
    }
    // Bersihkan token akses dari penyimpanan lokal browser
    localStorage.removeItem('access_token');
    // Bersihkan token refresh dari penyimpanan lokal browser
    localStorage.removeItem('refresh_token');
    // Set status user menjadi null untuk mengembalikan aplikasi ke kondisi belum masuk
    setUser(null);
  };

  return (
    // Menyediakan data state user, loading, login, register, dan logout ke komponen anak
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom useAuth untuk mempermudah pemanggilan konteks autentikasi di seluruh komponen
export const useAuth = () => useContext(AuthContext);
