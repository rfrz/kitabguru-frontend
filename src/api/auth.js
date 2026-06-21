// Mengimpor instans klien HTTP apiClient
import { apiClient } from './client';

// Mengekspor objek kumpulan fungsi integrasi API Autentikasi (authApi)
export const authApi = {
  // Fungsi asinkron untuk masuk (login) ke sistem
  login: async (credentials) => {
    // Mengirimkan request POST berisi email & password ke '/auth/login'
    const { data } = await apiClient.post('/auth/login', credentials);
    // Mengembalikan data respons (profil publik user dan sepasang token JWT)
    return data;
  },
  // Fungsi asinkron untuk mendaftarkan akun baru (register)
  register: async (credentials) => {
    // Mengirimkan request POST berisi username, email, & password ke '/auth/register'
    const { data } = await apiClient.post('/auth/register', credentials);
    // Mengembalikan data profil user dan token barunya
    return data;
  },
  // Fungsi asinkron untuk keluar dari akun (logout)
  logout: async (refreshToken) => {
    // Mengirimkan request POST berisi token refresh lama ke '/auth/logout' untuk dicabut di database server
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
  }
};
