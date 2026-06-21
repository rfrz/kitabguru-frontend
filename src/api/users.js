// Mengimpor instans klien HTTP apiClient
import { apiClient } from './client';

// Mengekspor objek kumpulan fungsi integrasi API User (usersApi)
export const usersApi = {
  // Fungsi asinkron untuk mengambil profil diri sendiri yang sedang login
  getMe: async () => {
    // Melakukan request GET ke '/users/me'
    const { data } = await apiClient.get('/users/me');
    // Mengembalikan data profil user
    return data;
  },
  // Fungsi asinkron untuk memperbarui data profil diri sendiri (seperti username/email/password)
  updateMe: async (payload) => {
    // Melakukan request PATCH ke '/users/me' berisi field yang diubah
    const { data } = await apiClient.patch('/users/me', payload);
    // Mengembalikan data profil user yang telah diubah
    return data;
  },
  // Fungsi asinkron untuk melakukan soft-delete akun sendiri
  deleteMe: async (payload) => {
    // Melakukan request DELETE ke '/users/me' (mengirim data password konfirmasi jika dibutuhkan)
    await apiClient.delete('/users/me', { data: payload });
  }
};
