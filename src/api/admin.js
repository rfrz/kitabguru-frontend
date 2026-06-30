// Mengimpor instans apiClient yang dikonfigurasi menggunakan Axios
import { apiClient } from './client';

// Mengekspor objek kumpulan fungsi integrasi API Admin (adminApi)
export const adminApi = {
  // Fungsi asinkron untuk mengambil daftar pengguna (users) terpaginasi
  getUsers: async (page = 1, limit = 10) => {
    // Melakukan request GET ke endpoint '/admin/users' dengan parameter page dan limit
    const { data } = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
    // Mengembalikan data hasil respons
    return data;
  },
  // Fungsi asinkron untuk mendaftarkan/membuat user baru oleh admin
  createUser: async (payload) => {
    // Melakukan request POST ke '/admin/users' berisi data payload user baru
    const { data } = await apiClient.post(`/admin/users`, payload);
    // Mengembalikan objek data user yang sukses dibuat
    return data;
  },
  // Fungsi asinkron untuk mengambil detail satu pengguna berdasarkan ID
  getUser: async (id) => {
    // Melakukan request GET ke '/admin/users/{id}'
    const { data } = await apiClient.get(`/admin/users/${id}`);
    // Mengembalikan detail profil user
    return data;
  },
  // Fungsi asinkron untuk memperbarui status/role pengguna
  updateUser: async (id, payload) => {
    // Melakukan request PATCH ke '/admin/users/{id}' berisi kolom yang diubah
    const { data } = await apiClient.patch(`/admin/users/${id}`, payload);
    // Mengembalikan detail profil user terupdate
    return data;
  },
  // Fungsi asinkron untuk menghapus permanen pengguna dari database
  deleteUser: async (id) => {
    // Melakukan request DELETE ke '/admin/users/{id}'
    await apiClient.delete(`/admin/users/${id}`);
  },
  // Fungsi asinkron untuk menampilkan daftar sesi chat semua pengguna
  getSessions: async (page = 1, limit = 10) => {
    // Melakukan request GET ke '/admin/sessions' terpaginasi
    const { data } = await apiClient.get(`/admin/sessions?page=${page}&limit=${limit}`);
    // Mengembalikan data list sesi
    return data;
  },
  // Fungsi asinkron untuk mengambil detail satu sesi chat beserta riwayat pesannya
  getSession: async (id) => {
    // Melakukan request GET ke '/admin/sessions/{id}'
    const { data } = await apiClient.get(`/admin/sessions/${id}`);
    // Mengembalikan detail sesi chat
    return data;
  },
  // Fungsi asinkron untuk menampilkan daftar sesi percakapan perangkat IoT
  getIoTSessions: async (page = 1, limit = 10) => {
    // Melakukan request GET ke '/admin/iot/sessions' terpaginasi
    const { data } = await apiClient.get(`/admin/iot/sessions?page=${page}&limit=${limit}`);
    // Mengembalikan data list sesi IoT
    return data;
  },
  // Fungsi asinkron untuk mengambil detail sesi percakapan IoT beserta riwayat pesan suaranya
  getIoTSession: async (id) => {
    // Melakukan request GET ke '/admin/iot/sessions/{id}'
    const { data } = await apiClient.get(`/admin/iot/sessions/${id}`);
    // Mengembalikan detail sesi IoT
    return data;
  },
  // Fungsi asinkron untuk menghapus satu sesi chat pengguna
  deleteSession: async (id) => {
    // Melakukan request DELETE ke '/admin/sessions/{id}'
    await apiClient.delete(`/admin/sessions/${id}`);
  },
  // Fungsi asinkron untuk menghapus rekaman sesi IoT
  deleteIoTSession: async (id) => {
    // Melakukan request DELETE ke '/admin/iot/sessions/{id}'
    await apiClient.delete(`/admin/iot/sessions/${id}`);
  },
  // Document Management Endpoints
  getDocuments: async (skip = 0, limit = 10, search = '') => {
    let url = `/admin/documents?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const { data } = await apiClient.get(url);
    return data;
  },
  importDocument: async (file, title, author) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (author) formData.append('author', author);
    const { data } = await apiClient.post('/admin/documents/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000 // 10 minutes timeout for upload
    });
    return data;
  },
  getDocumentTask: async (taskId) => {
    const { data } = await apiClient.get(`/admin/documents/tasks/${taskId}`);
    return data;
  },
  updateDocument: async (bookId, payload) => {
    const { data } = await apiClient.patch(`/admin/documents/${bookId}`, payload);
    return data;
  },
  deleteDocument: async (bookId) => {
    await apiClient.delete(`/admin/documents/${bookId}`);
  }
};
