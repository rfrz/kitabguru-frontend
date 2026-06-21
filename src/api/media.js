// Mengimpor instans klien HTTP apiClient
import { apiClient } from './client';

// Mengekspor objek kumpulan fungsi integrasi API Media (mediaApi)
export const mediaApi = {
  // Fungsi asinkron untuk memicu pembuatan gambar AI (SDXL) berdasarkan pesan tertentu
  generateImage: async (sessionId, messageId) => {
    // Melakukan request POST ke '/media/generate/image' membawa ID sesi dan ID pesan acuan
    const { data } = await apiClient.post('/media/generate/image', { session_id: sessionId, message_id: messageId });
    // Mengembalikan data respons (metadata gambar yang dibuat)
    return data;
  },
  // Fungsi asinkron untuk memicu antrean pemrosesan video asinkron
  generateVideo: async (sessionId, messageId) => {
    // Melakukan request POST ke '/media/generate/video' membawa ID sesi dan ID pesan acuan
    const { data } = await apiClient.post('/media/generate/video', { session_id: sessionId, message_id: messageId });
    // Mengembalikan data respons (ID pekerjaan/job video)
    return data;
  },
  // Fungsi asinkron untuk memantau status antrean pemrosesan video
  getJobStatus: async (jobId) => {
    // Melakukan request GET ke '/media/jobs/{jobId}' untuk melihat persentase progress dan status selesai
    const { data } = await apiClient.get(`/media/jobs/${jobId}`);
    // Mengembalikan data status pekerjaan
    return data;
  },
  // Fungsi asinkron untuk mengambil metadata item media tertentu berdasarkan ID
  getMedia: async (mediaId) => {
    // Melakukan request GET ke '/media/{mediaId}'
    const { data } = await apiClient.get(`/media/${mediaId}`);
    // Mengembalikan detail metadata media
    return data;
  },
  // Fungsi asinkron untuk menampilkan seluruh koleksi gambar & video milik user
  getUserMedia: async () => {
    // Melakukan request GET ke '/media/user'
    const { data } = await apiClient.get('/media/user');
    // Mengembalikan daftar media
    return data;
  }
};
