// src/pages/usuarios/UsuarioForm.jsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../../services/usuariosService';

const ROLES = ['GERENTE', 'OPERARIO'];

export function UsuarioForm({ usuario, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: usuario || {
      nombre: '',
      email: '',
      password: '',
      rol: 'OPERARIO',
      estado: true
    }
  });

  const createMutation = useMutation({
    mutationFn: usuariosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => usuariosService.update(usuario.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      onClose();
    }
  });

  const onSubmit = async (data) => {
    // Si es una actualización y no se proporciona contraseña, la eliminamos
    if (usuario && !data.password) {
      delete data.password;
    }

    if (usuario) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;
  const error = createMutation.error || updateMutation.error;

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Cerrar</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-white">
                      {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                      {/* Nombre */}
                      <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">
                          Nombre
                        </label>
                        <input
                          type="text"
                          {...register('nombre', { required: 'El nombre es requerido' })}
                          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        />
                        {errors.nombre && (
                          <p className="mt-1 text-sm text-red-400">{errors.nombre.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                          Email
                        </label>
                        <input
                            type="email"
                            {...register('email', { 
                              required: 'El email es requerido',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email inválido'
                              }
                            })}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                          )}
                        </div>
  
                        {/* Contraseña */}
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Contraseña {usuario && '(dejar en blanco para mantener la actual)'}
                          </label>
                          <input
                            type="password"
                            {...register('password', { 
                              required: !usuario ? 'La contraseña es requerida' : false,
                              minLength: {
                                value: 6,
                                message: 'La contraseña debe tener al menos 6 caracteres'
                              }
                            })}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                          />
                          {errors.password && (
                            <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                          )}
                        </div>
  
                        {/* Rol */}
                        <div>
                          <label htmlFor="rol" className="block text-sm font-medium text-gray-300">
                            Rol
                          </label>
                          <select
                            {...register('rol', { required: 'El rol es requerido' })}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                          >
                            {ROLES.map(rol => (
                              <option key={rol} value={rol}>{rol}</option>
                            ))}
                          </select>
                          {errors.rol && (
                            <p className="mt-1 text-sm text-red-400">{errors.rol.message}</p>
                          )}
                        </div>
  
                        {/* Estado */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            {...register('estado')}
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="estado" className="ml-2 block text-sm text-gray-300">
                            Usuario activo
                          </label>
                        </div>
  
                        {error && (
                          <div className="rounded-md bg-red-900 bg-opacity-50 p-4">
                            <p className="text-sm text-red-400">
                              Error al {usuario ? 'actualizar' : 'crear'} el usuario. Por favor, intente nuevamente.
                            </p>
                          </div>
                        )}
  
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                              </>
                            ) : usuario ? 'Actualizar' : 'Crear'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={onClose}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }