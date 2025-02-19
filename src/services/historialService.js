// src/services/historialService.js
import { api } from '../lib/axios';

export const historialService = {
  getAll: async () => {
    try {
      console.log('Fetching historial...');
      const { data } = await api.get('/api/historial');
      console.log('Historial received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching historial:', error);
      throw error;
    }
  },

  create: async (historialData) => {
    const { data } = await api.post('/api/historial', historialData);
    return data;
  },

  update: async (id, historialData) => {
    const { data } = await api.put(`/api/historial/${id}`, historialData);
    return data;
  },

  search: async (params) => {
    const queryParams = new URLSearchParams();
    if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
    if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
    if (params.tipo_afilado) queryParams.append('tipo_afilado', params.tipo_afilado);
    
    const { data } = await api.get(`/api/busqueda/historial?${queryParams.toString()}`);
    return data;
  },

  getHistorialBySierra: async (sierraId) => {
    const { data } = await api.get(`/api/reportes/sierra/${sierraId}/historial`);
    return data;
  }
};