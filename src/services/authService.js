// src/services/authService.js
import { api } from '../lib/axios';

export const authService = {
  login: async (credentials) => {
    try {
      const { data } = await api.post('/api/auth/login', credentials);
      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      // Guardar los datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol
      }));
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    try {
      const { data } = await api.get('/api/auth/profile');
      return data;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Usar para interceptor de Axios
  getToken: () => {
    return localStorage.getItem('token');
  }
};