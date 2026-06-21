// Mengimpor instans klien HTTP apiClient
import { apiClient } from './client';

// Mengekspor objek kumpulan fungsi integrasi API Chat (chatApi)
export const chatApi = {
  // Fungsi asinkron untuk mengambil semua daftar sesi chat milik user
  getSessions: async () => {
    // Melakukan request GET ke '/chat/sessions'
    const { data } = await apiClient.get('/chat/sessions');
    // Mengembalikan data list sesi chat
    return data;
  },
  // Fungsi asinkron untuk membuat sesi chat baru
  createSession: async (title) => {
    // Melakukan request POST ke '/chat/sessions' dengan payload judul sesi chat
    const { data } = await apiClient.post('/chat/sessions', { title });
    // Mengembalikan objek ringkasan sesi baru yang terbuat
    return data;
  },
  // Fungsi asinkron untuk mengambil data pesan di dalam satu sesi chat
  getSession: async (id) => {
    // Melakukan request GET ke '/chat/sessions/{id}'
    const { data } = await apiClient.get(`/chat/sessions/${id}`);
    // Mengembalikan data detail sesi dan pesan-pesannya
    return data;
  },
  // Fungsi asinkron untuk menghapus sesi chat
  deleteSession: async (id) => {
    // Melakukan request DELETE ke '/chat/sessions/{id}'
    await apiClient.delete(`/chat/sessions/${id}`);
  },
  // Fungsi asinkron untuk mengubah nama/judul sesi chat
  renameSession: async (id, title) => {
    // Melakukan request PATCH ke '/chat/sessions/{id}' dengan membawa nama judul baru
    const { data } = await apiClient.patch(`/chat/sessions/${id}`, { title });
    // Mengembalikan objek sesi yang telah diubah namanya
    return data;
  },
  // Fungsi asinkron untuk mengirim pesan baru dan memicu balasan AI RAG
  sendMessage: async (sessionId, content, bookFilter = null) => {
    // Melakukan request POST ke '/chat/sessions/{sessionId}/messages' dengan isi pesan dan filter buku opsional
    const { data } = await apiClient.post(`/chat/sessions/${sessionId}/messages`, {
      content,
      book_filter: bookFilter
    });
    // Mengembalikan respons berisi pesan user yang dikirim dan balasan AI
    return data;
  }
};
