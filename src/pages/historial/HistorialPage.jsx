// src/pages/historial/HistorialPage.jsx
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { historialService } from '../../services/historialService';
import { useAuth } from '../../hooks/useAuth';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { HistorialForm } from './HistorialForm';

const TIPOS_AFILADO = ['LOMO', 'PECHO', 'COMPLETO'];

export function HistorialPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    tipo_afilado: ''
  });
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: historial, isLoading, error } = useQuery({
    queryKey: ['historial', filters],
    queryFn: () => 
      filters.fecha_inicio || filters.fecha_fin || filters.tipo_afilado
        ? historialService.search(filters)
        : historialService.getAll()
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
          <p className="text-gray-400">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error al cargar el historial:</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Historial de Afilados</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Afilado
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Fecha Inicio
            </label>
            <input
              type="date"
              name="fecha_inicio"
              value={filters.fecha_inicio}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Fecha Fin
            </label>
            <input
              type="date"
              name="fecha_fin"
              value={filters.fecha_fin}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Tipo de Afilado
            </label>
            <select
              name="tipo_afilado"
              value={filters.tipo_afilado}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            >
              <option value="">Todos</option>
              {TIPOS_AFILADO.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de historial */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border border-gray-700 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Sierra
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tipo de Afilado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Operario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {historial?.map((registro) => (
                    <tr key={registro.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(registro.fecha).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {registro.sierra?.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${registro.tipo_afilado === 'COMPLETO' ? 'bg-green-100 text-green-800' : 
                            registro.tipo_afilado === 'LOMO' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {registro.tipo_afilado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {registro.usuario?.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {registro.observaciones || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <HistorialForm
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}