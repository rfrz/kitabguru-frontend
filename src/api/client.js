// Mengimpor library axios untuk melakukan request HTTP
import axios from 'axios';

// Membaca URL dasar API dari environment variable Vite, atau default ke localhost port 8001
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

// Membuat dan mengonfigurasi instans Axios khusus (apiClient)
export const apiClient = axios.create({
  // URL dasar endpoint API
  baseURL: API_BASE_URL,
  // Header bawaan request berupa tipe konten JSON
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Menyisipkan token akses JWT ke setiap request keluar jika token tersedia
apiClient.interceptors.request.use(
  (config) => {
    // Mengambil token akses dari penyimpanan lokal browser (localStorage)
    const token = localStorage.getItem('access_token');
    // Jika token akses ada
    if (token) {
      // Menyematkan token Bearer ke header HTTP Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Mengembalikan konfigurasi request yang telah diperbarui
    return config;
  },
  // Meneruskan error jika konfigurasi request gagal disusun
  (error) => Promise.reject(error)
);

// Response Interceptor: Menangani penyegaran token otomatis (auto refresh) jika mendapati status HTTP 401 Unauthorized
// Bendera penanda apakah proses request refresh token sedang berjalan
let isRefreshing = false;
// Antrean penampung request HTTP yang tertunda menunggu token baru diterbitkan
let failedQueue = [];

// Memproses dan melepaskan request-request dalam antrean setelah token baru didapatkan
const processQueue = (error, token = null) => {
  // Iterasi seluruh request dalam antrean
  failedQueue.forEach((prom) => {
    // Jika terjadi error refresh, batalkan (reject) request tertunda tersebut
    if (error) {
      prom.reject(error);
    // Jika sukses, selesaikan (resolve) request tertunda dengan membawa token baru
    } else {
      prom.resolve(token);
    }
  });
  // Mengosongkan kembali daftar antrean
  failedQueue = [];
};

// Mengonfigurasi interceptor respons Axios untuk menangkap error 401 secara asinkron
apiClient.interceptors.response.use(
  // Jika respons sukses langsung teruskan respons tersebut apa adanya
  (response) => response,
  // Jika terjadi kesalahan respons (error)
  async (error) => {
    // Menyimpan konfigurasi request asli yang memicu error
    const originalRequest = error.config;

    // Memeriksa apakah status error adalah 401 (Unauthorized) dan request asli belum pernah dicoba ulang (_retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Jika proses refresh token sedang berjalan oleh request lain sebelumnya
      if (isRefreshing) {
        // Kembalikan objek Promise baru untuk menunda eksekusi request ini
        return new Promise(function (resolve, reject) {
          // Masukkan promise tunda (resolve/reject) ke antrean failedQueue
          failedQueue.push({ resolve, reject });
        })
          // Setelah token baru didapatkan dari proses refresh yang sedang berjalan
          .then((token) => {
            // Perbarui token di header Authorization request asli
            originalRequest.headers.Authorization = `Bearer ${token}`;
            // Jalankan ulang request asli menggunakan apiClient
            return apiClient(originalRequest);
          })
          // Teruskan error jika proses refresh token sebelumnya ternyata gagal
          .catch((err) => Promise.reject(err));
      }

      // Menandai request asli sudah mencoba melakukan proses ulang (retry) agar tidak terjadi loop tak terbatas
      originalRequest._retry = true;
      // Mengubah bendera refresh aktif ke True
      isRefreshing = true;
      // Mengambil token refresh dari penyimpanan lokal browser
      const refreshToken = localStorage.getItem('refresh_token');

      // Jika token refresh tidak ada di penyimpanan lokal
      if (!refreshToken) {
        // Bersihkan data token lama
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Alihkan paksa halaman browser ke layar masuk (/login)
        window.location.href = '/login';
        // Kembalikan Promise reject berisi pesan error
        return Promise.reject(error);
      }

      try {
        // Melakukan request POST asinkron langsung via Axios mentah ke endpoint refresh token
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        // Menyimpan sepasang token baru hasil refresh ke penyimpanan lokal browser
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        // Memperbarui header Authorization default instans apiClient dengan token baru
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        // Memperbarui header Authorization request asli dengan token baru
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

        // Lepaskan antrean tertunda dengan sukses membawa token akses baru
        processQueue(null, data.access_token);
        // Jalankan ulang request asli menggunakan apiClient
        return apiClient(originalRequest);
      // Menangkap error jika proses refresh token gagal/kedaluwarsa di server
      } catch (refreshError) {
        // Batalkan seluruh antrean request tertunda
        processQueue(refreshError, null);
        // Bersihkan data token di lokal
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Alihkan halaman ke login
        window.location.href = '/login';
        // Kembalikan Promise reject
        return Promise.reject(refreshError);
      // Blok finally dijalankan untuk mereset status refresh aktif ke False
      } finally {
        isRefreshing = false;
      }
    }

    // Mengembalikan Promise reject untuk error respons selain status 401
    return Promise.reject(error);
  }
);
