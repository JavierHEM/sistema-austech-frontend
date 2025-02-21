// src/pages/usuarios/UsuarioDetailPage.jsx
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUsuario, useChangeUserStatus, useDeleteUsuario, useResetPassword } from '../../hooks/useUsuariosData';
import { useAuth } from '../../hooks/useAuth';

export const UsuarioDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  // Consulta para obtener los datos del usuario
  const { 
    data: usuario, 
    isLoading, 
    error,
    refetch 
  } = useUsuario(id);
  
  // Mutaciones para acciones
  const changeStatusMutation = useChangeUserStatus();
  const deleteMutation = useDeleteUsuario();
  const resetPasswordMutation = useResetPassword();
  
  // Estado para el formulario de restablecimiento de contraseña
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  
  const handleToggleStatus = async () => {
    try {
      await changeStatusMutation.mutateAsync({ 
        id, 
        estado: !usuario.estado 
      });
      // La invalidación de la consulta ya está manejada en el hook
      refetch(); // Actualizamos explícitamente los datos
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await deleteMutation.mutateAsync(id);
        navigate('/usuarios');
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    // Validar longitud mínima
    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      await resetPasswordMutation.mutateAsync({ id, newPassword });
      setShowResetForm(false);
      setNewPassword('');
      setConfirmPassword('');
      alert('Contraseña restablecida con éxito');
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      setPasswordError('Error al restablecer la contraseña: ' + err.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 text-white">
        <div className="animate-spin h-8 w-8 mr-3 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
        <span>Cargando información del usuario...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4" role="alert">
          Error al cargar datos: {error.message}
        </div>
        <button
          onClick={() => navigate('/usuarios')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Volver a la lista
        </button>
      </div>
    );
  }
  
  if (!usuario) {
    return <div className="text-center py-10 text-white">Usuario no encontrado</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 border border-gray-700 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Detalle del Usuario</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/usuarios')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Volver
            </button>
            
            {currentUser?.rol === 'GERENTE' && (
              <Link
                to={`/usuarios/${id}/editar`}
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Editar
              </Link>
            )}
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-bold text-gray-400">NOMBRE</h2>
              <p className="text-lg text-white">{usuario.nombre}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold text-gray-400">EMAIL</h2>
              <p className="text-lg text-white">{usuario.email}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold text-gray-400">ROL</h2>
              <p className="text-lg">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.rol === 'GERENTE' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}`}>
                  {usuario.rol}
                </span>
              </p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold text-gray-400">ESTADO</h2>
              <p className="text-lg">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.estado ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                  {usuario.estado ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
            
            {usuario.created_at && (
              <div>
                <h2 className="text-sm font-bold text-gray-400">FECHA DE CREACIÓN</h2>
                <p className="text-lg text-white">
                  {new Date(usuario.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {currentUser?.rol === 'GERENTE' && (
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleToggleStatus}
              disabled={changeStatusMutation.isPending}
              className={`${usuario.estado ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded`}
            >
              {changeStatusMutation.isPending
                ? 'Procesando...'
                : (usuario.estado ? 'Desactivar Usuario' : 'Activar Usuario')}
            </button>
            
            <button
              onClick={() => setShowResetForm(!showResetForm)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
            >
              Restablecer Contraseña
            </button>
            
            {currentUser.id !== usuario.id && (
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar Usuario'}
              </button>
            )}
          </div>
        )}
        
        {showResetForm && (
          <div className="mt-6 p-4 border border-gray-600 bg-gray-900 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Restablecer Contraseña</h2>
            
            {passwordError && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4" role="alert">
                {passwordError}
              </div>
            )}
            
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="newPassword">
                  Nueva Contraseña
                </label>
                <input
                  className="shadow appearance-none bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  id="newPassword"
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirmar Contraseña
                </label>
                <input
                  className="shadow appearance-none bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? 'Restableciendo...' : 'Restablecer Contraseña'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(false);
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuarioDetailPage;