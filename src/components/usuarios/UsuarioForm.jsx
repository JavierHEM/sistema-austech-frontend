// src/components/usuarios/UsuarioForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usuariosService } from '../../services/usuariosService';

const UsuarioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'OPERARIO',
    estado: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadUsuario = async () => {
      if (isEditing) {
        setLoading(true);
        try {
          const data = await usuariosService.getById(id);
          // No incluimos la contraseña en el formulario de edición
          const { password, ...usuarioData } = data;
          setFormData(usuarioData);
        } catch (err) {
          console.error('Error al cargar usuario:', err);
          setError('Error al cargar los datos del usuario');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadUsuario();
  }, [id, isEditing]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing) {
        // Si estamos editando, no enviamos la contraseña vacía
        const { password, ...dataToUpdate } = formData;
        await usuariosService.update(id, dataToUpdate);
      } else {
        // En creación, la contraseña es obligatoria
        await usuariosService.create(formData);
      }
      
      navigate('/usuarios');
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setError(
        err.response?.data?.message || 
        'Error al guardar los datos. Por favor, verifica la información e intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditing) {
    return <div className="text-center py-10">Cargando datos del usuario...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre completo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Correo electrónico
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rol">
            Rol
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Usuario activo</span>
            </label>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate('/usuarios')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;