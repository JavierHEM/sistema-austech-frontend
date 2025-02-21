// src/services/usuariosService.js
import { api } from '../lib/axios';

export const usuariosService = {
  getAll: async () => {
    try {
      const { data } = await api.get('/api/usuarios');
      return data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/api/usuarios/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al obtener usuario ${id}:`, error);
      throw error;
    }
  },

  create: async (userData) => {
    try {
      const { data } = await api.post('/api/usuarios', userData);
      return data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  update: async (id, userData) => {
    try {
      const { data } = await api.put(`/api/usuarios/${id}`, userData);
      return data;
    } catch (error) {
      console.error(`Error al actualizar usuario ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { data } = await api.delete(`/api/usuarios/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al eliminar usuario ${id}:`, error);
      throw error;
    }
  },

  changeStatus: async (id, estado) => {
    try {
      const { data } = await api.patch(`/api/usuarios/${id}/estado`, { estado });
      return data;
    } catch (error) {
      console.error(`Error al cambiar estado de usuario ${id}:`, error);
      throw error;
    }
  },
  
  resetPassword: async (id, newPassword) => {
    try {
      const { data } = await api.post(`/api/usuarios/${id}/reset-password`, { newPassword });
      return data;
    } catch (error) {
      console.error(`Error al restablecer contraseña de usuario ${id}:`, error);
      throw error;
    }
  }
};