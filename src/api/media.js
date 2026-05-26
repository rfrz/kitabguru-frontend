import { apiClient } from './client';

export const mediaApi = {
  generateImage: async (sessionId) => {
    const { data } = await apiClient.post('/media/generate/image', { session_id: sessionId });
    return data;
  },
  generateVideo: async (sessionId) => {
    const { data } = await apiClient.post('/media/generate/video', { session_id: sessionId });
    return data;
  },
  getJobStatus: async (jobId) => {
    const { data } = await apiClient.get(`/media/jobs/${jobId}`);
    return data;
  },
  getMedia: async (mediaId) => {
    const { data } = await apiClient.get(`/media/${mediaId}`);
    return data;
  },
  getUserMedia: async () => {
    const { data } = await apiClient.get('/media/user');
    return data;
  }
};
