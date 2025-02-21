// src/components/usuarios/UsuarioDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usuariosService } from '../../services/usuariosService';
import { authService } from '../../services/authService';

const UsuarioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useState(authService.getUser());
  
  // Estado para el formulario de restablecimiento de contraseña
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  
  useEffect(() => {
    const loadUsuario = async () => {
      setLoading(true);
      try {
        const data = await usuariosService.getById(id);
        setUsuario(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        setError('Error al cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };
    
    loadUsuario();
  }, [id]);
  
  const handleToggleStatus = async () => {
    try {
      await usuariosService.changeStatus(id, !usuario.estado);
      // Actualizar los datos
      setUsuario({
        ...usuario,
        estado: !usuario.estado
      });
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError('Error al cambiar el estado del usuario');
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await usuariosService.delete(id);
        navigate('/usuarios');
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
        setError('Error al eliminar el usuario');
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
    
    setResetLoading(true);
    try {
      await usuariosService.resetPassword(id, newPassword);
      setShowResetForm(false);
      setNewPassword('');
      setConfirmPassword('');
      alert('Contraseña restablecida con éxito');
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      setPasswordError('Error al restablecer la contraseña');
    } finally {
      setResetLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Cargando información del usuario...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
        <button
          onClick={() => navigate('/usuarios')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver a la lista
        </button>
      </div>
    );
  }
  
  if (!usuario) {
    return <div className="text-center py-10">Usuario no encontrado</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detalle del Usuario</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/usuarios')}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Volver
            </button>
            
            {currentUser?.rol === 'GERENTE' && (
              <Link
                to={`/usuarios/${id}/editar`}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Editar
              </Link>
            )}
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-bold text-gray-500">NOMBRE</h2>
              <p className="text-lg">{usuario.nombre}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold text-gray-500">EMAIL</h2>
              <p className="text-lg">{usuario.email}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold text-gray-500">ROL</h2>
              <p className="text-lg">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.rol === 'GERENTE' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {usuario.rol}
                </span>
              </p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold text-gray-500">ESTADO</h2>
              <p className="text-lg">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {usuario.estado ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
            
            {usuario.created_at && (
              <div>
                <h2 className="text-sm font-bold text-gray-500">FECHA DE CREACIÓN</h2>
                <p className="text-lg">
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
              className={`${usuario.estado ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-green-500 hover:bg-green-700'} text-white px-4 py-2 rounded`}
            >
              {usuario.estado ? 'Desactivar Usuario' : 'Activar Usuario'}
            </button>
            
            <button
              onClick={() => setShowResetForm(!showResetForm)}
              className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded"
            >
              Restablecer Contraseña
            </button>
            
            {currentUser.id !== usuario.id && (
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Eliminar Usuario
              </button>
            )}
          </div>
        )}
        
        {showResetForm && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Restablecer Contraseña</h2>
            
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                {passwordError}
              </div>
            )}
            
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                  Nueva Contraseña
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirmar Contraseña
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(false);
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default UsuarioDetail;