// src/services/reportesService.js
import { api } from '../lib/axios';

export const reportesService = {
  getEstadisticas: async () => {
    try {
      console.log('Solicitando estadísticas...');
      const { data } = await api.get('/api/reportes/estadisticas');
      console.log('Estadísticas recibidas:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error.response?.data || error.message);
      throw error;
    }
  },

  getHistorialSierra: async (sierraId) => {
    const { data } = await api.get(`/api/reportes/sierra/${sierraId}/historial`);
    return data;
  },

  getHistorialCliente: async (clienteId) => {
    const { data } = await api.get(`/api/reportes/cliente/${clienteId}/historial`);
    return data;
  },

  getSierrasCliente: async (clienteId) => {
    const { data } = await api.get(`/api/reportes/cliente/${clienteId}/sierras`);
    return data;
  }
};