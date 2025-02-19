// src/services/sierrasService.js
import { api } from '../lib/axios';

export const sierrasService = {
  getAll: async () => {
    try {
      console.log('Fetching sierras...');
      const { data } = await api.get('/api/sierras');
      console.log('Sierras received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching sierras:', error);
      throw error;
    }
  },

  getById: async (id) => {
    const { data } = await api.get(`/api/sierras/${id}`);
    return data;
  },

  create: async (sierraData) => {
    const { data } = await api.post('/api/sierras', sierraData);
    return data;
  },

  update: async (id, sierraData) => {
    const { data } = await api.put(`/api/sierras/${id}`, sierraData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/api/sierras/${id}`);
    return data;
  },

  search: async (codigo) => {
    const { data } = await api.get(`/api/busqueda/sierras?codigo=${codigo}`);
    return data;
  }
};

export const tiposSierraService = {
  getAll: async () => {
    try {
      const { data } = await api.get('/api/tipos-sierra');
      return data;
    } catch (error) {
      console.error('Error fetching tipos sierra:', error);
      throw error;
    }
  },

  create: async (tipoData) => {
    const { data } = await api.post('/api/tipos-sierra', tipoData);
    return data;
  },

  update: async (id, tipoData) => {
    const { data } = await api.put(`/api/tipos-sierra/${id}`, tipoData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/api/tipos-sierra/${id}`);
    return data;
  }
};