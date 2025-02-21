// src/hooks/useUsuariosData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../services/usuariosService';

// Hook para obtener todos los usuarios
export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener un usuario por ID
export const useUsuario = (id, options = {}) => {
  return useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => usuariosService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    ...options
  });
};

// Hook para crear un usuario
export const useCreateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => usuariosService.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    }
  });
};

// Hook para actualizar un usuario
export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }) => usuariosService.update(id, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios', variables.id] });
    }
  });
};

// Hook para cambiar el estado de un usuario
export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, estado }) => usuariosService.changeStatus(id, estado),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios', variables.id] });
    }
  });
};

// Hook para eliminar un usuario
export const useDeleteUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => usuariosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    }
  });
};

// Hook para restablecer contraseña
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ id, newPassword }) => usuariosService.resetPassword(id, newPassword)
  });
};