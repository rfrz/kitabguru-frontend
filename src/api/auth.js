import { apiClient } from './client';

export const authApi = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },
  register: async (credentials) => {
    const { data } = await apiClient.post('/auth/register', credentials);
    return data;
  },
  logout: async (refreshToken) => {
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
  }
};
