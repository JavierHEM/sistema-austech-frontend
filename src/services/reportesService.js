// src/services/reportesService.js
import { api } from '../lib/axios';

export const reportesService = {
  getHistorialSierra: async (sierraId) => {
    try {
      const { data } = await api.get(`/api/reportes/sierra/${sierraId}/historial`);
      return data;
    } catch (error) {
      console.error('Error fetching sierra historial:', error);
      throw error;
    }
  },

  getHistorialCliente: async (clienteId) => {
    try {
      const { data } = await api.get(`/api/reportes/cliente/${clienteId}/historial`);
      return data;
    } catch (error) {
      console.error('Error fetching client historial:', error);
      throw error;
    }
  },

  getSierrasCliente: async (clienteId) => {
    try {
      const { data } = await api.get(`/api/reportes/cliente/${clienteId}/sierras`);
      return data;
    } catch (error) {
      console.error('Error fetching client sierras:', error);
      throw error;
    }
  },

  getEstadisticas: async () => {
    try {
      const { data } = await api.get('/api/reportes/estadisticas');
      return data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
};