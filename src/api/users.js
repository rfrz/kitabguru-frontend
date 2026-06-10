import { apiClient } from './client';

export const usersApi = {
  getMe: async () => {
    const { data } = await apiClient.get('/users/me');
    return data;
  },
  updateMe: async (payload) => {
    const { data } = await apiClient.patch('/users/me', payload);
    return data;
  },
  deleteMe: async () => {
    await apiClient.delete('/users/me');
  }
};
