// src/services/clientesService.js
import { api } from '../lib/axios';

export const clientesService = {
  getAll: async () => {
    try {
      console.log('Fetching clientes...');
      const { data } = await api.get('/api/clientes');
      console.log('Clientes received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching clientes:', error);
      throw error;
    }
  },

  getById: async (id) => {
    const { data } = await api.get(`/api/clientes/${id}`);
    return data;
  },

  create: async (clienteData) => {
    const { data } = await api.post('/api/clientes', clienteData);
    return data;
  },

  update: async (id, clienteData) => {
    const { data } = await api.put(`/api/clientes/${id}`, clienteData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/api/clientes/${id}`);
    return data;
  },

  search: async (nombre) => {
    const { data } = await api.get(`/api/busqueda/clientes?nombre=${nombre}`);
    return data;
  }
};