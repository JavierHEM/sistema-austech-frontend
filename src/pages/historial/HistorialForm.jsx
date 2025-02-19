// src/pages/historial/HistorialForm.jsx
import { Fragment, useState } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { historialService } from '../../services/historialService';
import { sierrasService } from '../../services/sierrasService';
import { useAuth } from '../../hooks/useAuth';

const TIPOS_AFILADO = ['LOMO', 'PECHO', 'COMPLETO'];

export function HistorialForm({ onClose, sierra = null }) {
  const [esUltimoAfilado, setEsUltimoAfilado] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Cargar sierras disponibles
  const { data: sierras, isLoading: loadingSierras } = useQuery({
    queryKey: ['sierras'],
    queryFn: sierrasService.getAll,
    select: (data) => data.filter(s => s.estado) // Solo sierras activas
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      sierra_id: sierra ? sierra.id : '',
      tipo_afilado: '',
      observaciones: ''
    }
  });

  const selectedSierraId = watch('sierra_id');

  // Verificar historial de la sierra seleccionada
  const { data: historialSierra, isLoading: loadingHistorial } = useQuery({
    queryKey: ['historial-sierra', selectedSierraId],
    queryFn: () => historialService.getHistorialBySierra(selectedSierraId),
    enabled: !!selectedSierraId // Solo ejecutar si hay una sierra seleccionada
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const formData = {
        ...data,
        usuario_id: user.id,
        fecha: new Date().toISOString(),
        ultimo_afilado: esUltimoAfilado
      };

      if (esUltimoAfilado) {
        // Si es el último afilado, actualizar el estado de la sierra
        await sierrasService.update(formData.sierra_id, {
          fecha_ultimo_afilado: new Date().toISOString(),
          estado: false
        });
      }

      return historialService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['historial']);
      queryClient.invalidateQueries(['sierras']);
      onClose();
    }
  });

  if (loadingSierras || loadingHistorial) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
          <p className="text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

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
                      Registrar Afilado
                    </Dialog.Title>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                      {/* Sierra */}
                      {!sierra && (
                        <div>
                          <label htmlFor="sierra_id" className="block text-sm font-medium text-gray-300">
                            Sierra
                          </label>
                          <select
                            {...register('sierra_id', { required: 'La sierra es requerida' })}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                          >
                            <option value="">Seleccione una sierra</option>
                            {sierras?.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.codigo} - {s.clientes?.nombre}
                              </option>
                            ))}
                          </select>
                          {errors.sierra_id && (
                            <p className="mt-1 text-sm text-red-400">{errors.sierra_id.message}</p>
                          )}
                        </div>
                      )}

                      {/* Tipo de Afilado */}
                      <div>
                        <label htmlFor="tipo_afilado" className="block text-sm font-medium text-gray-300">
                          Tipo de Afilado
                        </label>
                        <select
                          {...register('tipo_afilado', { required: 'El tipo de afilado es requerido' })}
                          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        >
                          <option value="">Seleccione un tipo</option>
                          {TIPOS_AFILADO.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                        {errors.tipo_afilado && (
                          <p className="mt-1 text-sm text-red-400">{errors.tipo_afilado.message}</p>
                        )}
                      </div>

                      {/* Observaciones */}
                      <div>
                        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-300">
                          Observaciones
                        </label>
                        <textarea
                          {...register('observaciones')}
                          rows={3}
                          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        />
                      </div>

                      {/* Último Afilado Switch */}
                      <div className="flex items-center justify-between">
                        <span className="flex flex-grow flex-col">
                          <span className="text-sm font-medium text-gray-300">Último Afilado</span>
                          <span className="text-sm text-gray-500">
                            Marcar si este será el último afilado para esta sierra
                          </span>
                        </span>
                        <Switch
                          checked={esUltimoAfilado}
                          onChange={setEsUltimoAfilado}
                          className={`${
                            esUltimoAfilado ? 'bg-indigo-600' : 'bg-gray-600'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              esUltimoAfilado ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>

                      {esUltimoAfilado && (
                        <div className="rounded-md bg-yellow-900 p-4">
                          <p className="text-sm text-yellow-300">
                            ¡Atención! Al marcar este como último afilado, la sierra quedará inactiva 
                            y no se podrán registrar más afilados.
                          </p>
                        </div>
                      )}

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={createMutation.isLoading}
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {createMutation.isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Guardando...
                            </>
                          ) : 'Registrar Afilado'}
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