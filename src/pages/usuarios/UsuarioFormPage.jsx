// src/pages/usuarios/UsuarioFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsuario, useCreateUsuario, useUpdateUsuario } from '../../hooks/useUsuariosData';

export const UsuarioFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  // Consulta para obtener datos del usuario si estamos editando
  const { 
    data: usuarioData, 
    isLoading: isLoadingUsuario, 
    error: usuarioError 
  } = useUsuario(id, { enabled: isEditing });
  
  // Mutaciones para crear o actualizar usuario
  const createMutation = useCreateUsuario();
  const updateMutation = useUpdateUsuario();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'OPERARIO',
    estado: true
  });
  
  // Error local del formulario
  const [formError, setFormError] = useState(null);
  
  // Cargar datos del usuario cuando estamos editando
  useEffect(() => {
    if (isEditing && usuarioData) {
      // Excluir la contraseña de los datos cargados
      const { password, ...userData } = usuarioData;
      setFormData(userData);
    }
  }, [isEditing, usuarioData]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const validateForm = () => {
    // Validación básica
    if (!formData.nombre.trim()) {
      setFormError('El nombre es obligatorio');
      return false;
    }
    
    if (!formData.email.trim()) {
      setFormError('El correo electrónico es obligatorio');
      return false;
    }
    
    // Validar formato de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Formato de correo electrónico inválido');
      return false;
    }
    
    // Si estamos creando, la contraseña es obligatoria
    if (!isEditing && (!formData.password || formData.password.length < 6)) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    // Validar el formulario
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing) {
        // Para edición, eliminamos la contraseña si está vacía
        const { password, ...dataToUpdate } = formData;
        await updateMutation.mutateAsync({ 
          id, 
          userData: dataToUpdate 
        });
      } else {
        // Para creación, enviamos todos los datos
        await createMutation.mutateAsync(formData);
      }
      
      // Redireccionar a la lista de usuarios tras éxito
      navigate('/usuarios');
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setFormError(
        err.response?.data?.message || 
        'Error al guardar los datos. Por favor, verifica la información e intenta de nuevo.'
      );
    }
  };
  
  // Mostrar spinner de carga mientras se obtienen los datos para edición
  if (isEditing && isLoadingUsuario) {
    return (
      <div className="flex justify-center items-center py-10 text-white">
        <div className="animate-spin h-8 w-8 mr-3 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
        <span>Cargando datos del usuario...</span>
      </div>
    );
  }
  
  // Mostrar error si falla la carga de datos
  if (isEditing && usuarioError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          Error al cargar datos: {usuarioError.message}
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
  
  // Si estamos editando pero no hay datos, mostrar mensaje
  if (isEditing && !usuarioData) {
    return <div className="text-center py-10 text-white">Usuario no encontrado</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">
        {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h1>
      
      {formError && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {formError}
        </div>
      )}
      
      {(createMutation.isError || updateMutation.isError) && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {createMutation.error?.message || updateMutation.error?.message || 'Error al procesar la solicitud'}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre completo
          </label>
          <input
            className="shadow appearance-none bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
            Correo electrónico
          </label>
          <input
            className="shadow appearance-none bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        {!isEditing && (
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
              minLength={6}
            />
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="rol">
            Rol
          </label>
          <select
            className="shadow appearance-none bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
          >
            <option value="OPERARIO">OPERARIO</option>
            <option value="GERENTE">GERENTE</option>
          </select>
        </div>
        
        {isEditing && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-300">Usuario activo</span>
            </label>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {(createMutation.isPending || updateMutation.isPending) 
              ? 'Guardando...' 
              : 'Guardar'}
          </button>
          
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="button"
            onClick={() => navigate('/usuarios')}
          >
            Cancelar
          </button>
        </div>
      </form>
      
      {/* Indicador de procesamiento */}
      {(createMutation.isPending || updateMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded shadow-lg">
          <div className="flex items-center">
            <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            <p>{isEditing ? 'Actualizando usuario...' : 'Creando usuario...'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioFormPage;