// src/pages/usuarios/UsuariosPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsuarios, useChangeUserStatus, useDeleteUsuario } from '../../hooks/useUsuariosData';
import { useAuth } from '../../hooks/useAuth';

export const UsuariosPage = () => {
  const { user: currentUser } = useAuth();
  const { data: usuarios, isLoading, error, refetch } = useUsuarios();
  
  // Estados de confirmación para acciones
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [statusConfirmId, setStatusConfirmId] = useState(null);
  
  // Mutaciones
  const changeStatusMutation = useChangeUserStatus();
  const deleteMutation = useDeleteUsuario();
  
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await changeStatusMutation.mutateAsync({ 
        id, 
        estado: !currentStatus 
      });
      setStatusConfirmId(null);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  // Componente de confirmación para eliminar
  const DeleteConfirmation = ({ id, onCancel, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-bold mb-4 text-white">Confirmar eliminación</h3>
        <p className="mb-6 text-gray-300">¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  // Componente de confirmación para cambiar estado
  const StatusConfirmation = ({ id, currentStatus, onCancel, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-bold mb-4 text-white">Confirmar cambio de estado</h3>
        <p className="mb-6 text-gray-300">
          {currentStatus 
            ? '¿Estás seguro de desactivar este usuario? No podrá acceder al sistema hasta que se reactive.'
            : '¿Estás seguro de activar este usuario? Podrá acceder al sistema inmediatamente.'}
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(id, currentStatus)}
            className={`px-4 py-2 ${currentStatus ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded`}
          >
            {currentStatus ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 text-white">
        <div className="animate-spin h-8 w-8 mr-3 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
        <span>Cargando usuarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
        <p>Error al cargar usuarios: {error.message}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 bg-red-800 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
        {currentUser?.rol === 'GERENTE' && (
          <Link 
            to="/usuarios/nuevo" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Nuevo Usuario
          </Link>
        )}
      </div>
      
      {/* Tabla de usuarios */}
      <div className="overflow-x-auto bg-gray-800 border border-gray-700 shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {!usuarios || usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {usuario.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.rol === 'GERENTE' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.estado ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                      {usuario.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/usuarios/${usuario.id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Ver
                      </Link>
                      
                      {currentUser?.rol === 'GERENTE' && (
                        <>
                          <Link
                            to={`/usuarios/${usuario.id}/editar`}
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            Editar
                          </Link>
                          
                          <button
                            onClick={() => setStatusConfirmId(usuario.id)}
                            disabled={changeStatusMutation.isPending}
                            className={`${usuario.estado ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}
                          >
                            {usuario.estado ? 'Desactivar' : 'Activar'}
                          </button>
                          
                          {currentUser.id !== usuario.id && (
                            <button
                              onClick={() => setDeleteConfirmId(usuario.id)}
                              disabled={deleteMutation.isPending}
                              className="text-red-400 hover:text-red-300"
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
      
      {/* Modales de confirmación */}
      {deleteConfirmId && (
        <DeleteConfirmation 
          id={deleteConfirmId} 
          onCancel={() => setDeleteConfirmId(null)}
          onConfirm={handleDelete}
        />
      )}
      
      {statusConfirmId && (
        <StatusConfirmation 
          id={statusConfirmId}
          currentStatus={usuarios.find(u => u.id === statusConfirmId)?.estado}
          onCancel={() => setStatusConfirmId(null)}
          onConfirm={handleToggleStatus}
        />
      )}
      
      {/* Indicadores de estado de las mutaciones */}
      {(changeStatusMutation.isPending || deleteMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded shadow-lg">
          {changeStatusMutation.isPending && <p>Cambiando estado del usuario...</p>}
          {deleteMutation.isPending && <p>Eliminando usuario...</p>}
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;