// src/components/QuickSierraForm.jsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { sierrasService, tiposSierraService } from '../services/sierrasService';
import { clientesService } from '../services/clientesService';

export function QuickSierraForm({ initialCode, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      codigo: initialCode,
      tipo_sierra_id: '',
      cliente_id: '',
      estado: true
    }
  });

  // Cargar tipos de sierra
  const { data: tiposSierra, isLoading: loadingTipos } = useQuery({
    queryKey: ['tipos-sierra'],
    queryFn: tiposSierraService.getAll
  });

  // Cargar clientes
  const { data: clientes, isLoading: loadingClientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: clientesService.getAll,
    select: (data) => data.filter(cliente => cliente.estado) // Solo clientes activos
  });

  const createMutation = useMutation({
    mutationFn: sierrasService.create,
    onSuccess: (data) => {
      onSuccess(data);
    }
  });

  const onSubmit = (data) => {
    createMutation.mutate({
      ...data,
      tipo_sierra_id: Number(data.tipo_sierra_id),
      cliente_id: Number(data.cliente_id)
    });
  };

  const isLoading = loadingTipos || loadingClientes || createMutation.isLoading;

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
                      Registrar Nueva Sierra
                    </Dialog.Title>
                    
                    <div className="mt-4 bg-yellow-900 bg-opacity-50 rounded-md p-4">
                      <p className="text-yellow-200 text-sm">
                        No se encontró una sierra con el código especificado. 
                        Complete los siguientes datos para registrarla.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                      {/* Código */}
                      <div>
                        <label htmlFor="codigo" className="block text-sm font-medium text-gray-300">
                          Código
                        </label>
                        <input
                          type="text"
                          {...register('codigo', { 
                            required: 'El código es requerido',
                            pattern: {
                              value: /^[A-Za-z0-9-]+$/,
                              message: 'El código solo puede contener letras, números y guiones'
                            }
                          })}
                          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        />
                        {errors.codigo && (
                          <p className="mt-1 text-sm text-red-400">{errors.codigo.message}</p>
                        )}
                      </div>

                      {/* Tipo de Sierra */}
                      <div>
                        <label htmlFor="tipo_sierra_id" className="block text-sm font-medium text-gray-300">
                          Tipo de Sierra
                        </label>
                        <select
                          {...register('tipo_sierra_id', { required: 'El tipo de sierra es requerido' })}
                          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        >
                          <option value="">Seleccione un tipo</option>
                          {tiposSierra?.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                          ))}
                        </select>
                        {errors.tipo_sierra_id && (
                          <p className="mt-1 text-sm text-red-400">{errors.tipo_sierra_id.message}</p>
                        )}
                      </div>

                      {/* Cliente */}
                      <div>
                        <label htmlFor="cliente_id" className="block text-sm font-medium text-gray-300">
                          Cliente
                        </label>
                        <select
                          {...register('cliente_id', { required: 'El cliente es requerido' })}
                          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        >
                          <option value="">Seleccione un cliente</option>
                          {clientes?.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                          ))}
                        </select>
                        {errors.cliente_id && (
                          <p className="mt-1 text-sm text-red-400">{errors.cliente_id.message}</p>
                        )}
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Guardando...' : 'Registrar y Continuar'}
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