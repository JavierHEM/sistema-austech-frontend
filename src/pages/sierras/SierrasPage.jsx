// src/pages/sierras/SierrasPage.jsx
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { sierrasService } from '../../services/sierrasService';
import { useAuth } from '../../hooks/useAuth';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SierraForm } from './SierraForm';

export function SierrasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSierra, setSelectedSierra] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isGerente = user?.rol === 'GERENTE';

  const { data: sierras, isLoading, error } = useQuery({
    queryKey: ['sierras', searchTerm],
    queryFn: () => searchTerm ? sierrasService.search(searchTerm) : sierrasService.getAll()
  });

  const deleteSierra = useMutation({
    mutationFn: sierrasService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['sierras']);
    }
  });

  const handleEdit = (sierra) => {
    setSelectedSierra(sierra);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta sierra?')) {
      deleteSierra.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setSelectedSierra(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
          <p className="text-gray-400">Cargando sierras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error al cargar las sierras:</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Sierras</h2>
        {isGerente && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Sierra
          </button>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Buscar por código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de sierras */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border border-gray-700 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Código
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tipo de Sierra
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Último Afilado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    {isGerente && (
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {sierras?.map((sierra) => (
                    <tr key={sierra.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {sierra.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {sierra.tipos_sierra?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {sierra.clientes?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {sierra.fecha_ultimo_afilado ? new Date(sierra.fecha_ultimo_afilado).toLocaleDateString() : 'Sin afilar'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${sierra.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {sierra.estado ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      {isGerente && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(sierra)}
                            className="text-indigo-400 hover:text-indigo-300 mr-4"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(sierra.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SierraForm
          sierra={selectedSierra}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}