import { apiClient } from './client';

export const chatApi = {
  getSessions: async () => {
    const { data } = await apiClient.get('/chat/sessions');
    return data;
  },
  createSession: async (title) => {
    const { data } = await apiClient.post('/chat/sessions', { title });
    return data;
  },
  getSession: async (id) => {
    const { data } = await apiClient.get(`/chat/sessions/${id}`);
    return data;
  },
  deleteSession: async (id) => {
    await apiClient.delete(`/chat/sessions/${id}`);
  },
  renameSession: async (id, title) => {
    const { data } = await apiClient.patch(`/chat/sessions/${id}`, { title });
    return data;
  },
  sendMessage: async (sessionId, content, bookFilter = null) => {
    const { data } = await apiClient.post(`/chat/sessions/${sessionId}/messages`, {
      content,
      book_filter: bookFilter
    });
    return data;
  }
};
