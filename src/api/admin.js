import { apiClient } from './client';

export const adminApi = {
  getUsers: async (page = 1, limit = 10) => {
    const { data } = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
    return data;
  },
  getUser: async (id) => {
    const { data } = await apiClient.get(`/admin/users/${id}`);
    return data;
  },
  updateUser: async (id, payload) => {
    const { data } = await apiClient.patch(`/admin/users/${id}`, payload);
    return data;
  },
  deleteUser: async (id) => {
    await apiClient.delete(`/admin/users/${id}`);
  },
  getSessions: async (page = 1, limit = 10) => {
    const { data } = await apiClient.get(`/admin/sessions?page=${page}&limit=${limit}`);
    return data;
  },
  getSession: async (id) => {
    const { data } = await apiClient.get(`/admin/sessions/${id}`);
    return data;
  },
  getIoTSessions: async (page = 1, limit = 10) => {
    const { data } = await apiClient.get(`/admin/iot/sessions?page=${page}&limit=${limit}`);
    return data;
  },
  getIoTSession: async (id) => {
    const { data } = await apiClient.get(`/admin/iot/sessions/${id}`);
    return data;
  }
};
