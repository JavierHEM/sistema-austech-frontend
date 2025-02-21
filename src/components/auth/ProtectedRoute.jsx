// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/authService';

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si se requieren roles específicos y el usuario no tiene alguno de ellos
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Si pasa las validaciones, mostrar el contenido protegido
  return <Outlet />;
};

export default ProtectedRoute;