// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ClientesPage } from './pages/clientes/ClientesPage';
import { SierrasPage } from './pages/sierras/SierrasPage';
import { HistorialPage } from './pages/historial/HistorialPage';
import { ReportesPage } from './pages/reportes/ReportesPage';
import { UsuariosPage } from './pages/usuarios/UsuariosPage';
import { UsuarioDetailPage } from './pages/usuarios/UsuarioDetailPage';
import { UsuarioFormPage } from './pages/usuarios/UsuarioFormPage';
import { Layout } from './components/Layout';
import { useAuth } from './hooks/useAuth';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute allowedRoles={['GERENTE']}>
                <ClientesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sierras"
            element={
              <ProtectedRoute>
                <SierrasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <HistorialPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute allowedRoles={['GERENTE']}>
                <ReportesPage />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de gestión de usuarios */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute allowedRoles={['GERENTE']}>
                <UsuariosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/nuevo"
            element={
              <ProtectedRoute allowedRoles={['GERENTE']}>
                <UsuarioFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/:id"
            element={
              <ProtectedRoute allowedRoles={['GERENTE']}>
                <UsuarioDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/:id/editar"
            element={
              <ProtectedRoute allowedRoles={['GERENTE']}>
                <UsuarioFormPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta para manejar URLs no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;