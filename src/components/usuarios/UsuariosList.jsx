// src/components/usuarios/UsuariosList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usuariosService } from '../../services/usuariosService';
import { authService } from '../../services/authService';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useState(authService.getUser());
  
  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuariosService.getAll();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar la lista de usuarios. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await usuariosService.changeStatus(id, !currentStatus);
      // Actualizar la lista
      loadUsuarios();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError('Error al cambiar el estado del usuario.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await usuariosService.delete(id);
        // Actualizar la lista
        loadUsuarios();
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
        setError('Error al eliminar el usuario.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando usuarios...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        {currentUser?.rol === 'GERENTE' && (
          <Link 
            to="/usuarios/nuevo" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Nuevo Usuario
          </Link>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {usuario.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.rol === 'GERENTE' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {usuario.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/usuarios/${usuario.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver
                      </Link>
                      
                      {currentUser?.rol === 'GERENTE' && (
                        <>
                          <Link
                            to={`/usuarios/${usuario.id}/editar`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </Link>
                          
                          <button
                            onClick={() => handleToggleStatus(usuario.id, usuario.estado)}
                            className={`${usuario.estado ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {usuario.estado ? 'Desactivar' : 'Activar'}
                          </button>
                          
                          {currentUser.id !== usuario.id && (
                            <button
                              onClick={() => handleDelete(usuario.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosList;