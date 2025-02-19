// src/pages/Dashboard.jsx
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { QuickSearch } from '../components/QuickSearch';
import { 
  WrenchIcon, 
  ExclamationTriangleIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/dashboard/resumen');
      return data;
    },
  });

  return (
    <div className="space-y-8">
      {/* Encabezado y descripción */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Sistema de Gestión de Afilados
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Ingrese el código de la sierra para registrar un nuevo afilado o consultar su historial
        </p>
      </div>

      {/* Búsqueda rápida */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <QuickSearch />
      </div>

      {/* Estadísticas */}
      {!isLoading && dashboardData && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Afilados de hoy */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <WrenchIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Afilados Hoy
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">
                        {dashboardData?.afilados_hoy?.total || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Sierras que requieren atención */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Requieren Atención
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">
                        {dashboardData?.sierras_requieren_atencion?.length || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total del mes */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total del Mes
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">
                        {dashboardData?.resumen_mes?.total || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Último Afilado */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Último Afilado
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-sm font-semibold text-white">
                        {dashboardData?.ultimo_afilado?.fecha 
                          ? new Date(dashboardData.ultimo_afilado.fecha).toLocaleString()
                          : 'Sin registros'}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de sierras que requieren atención */}
      {dashboardData?.sierras_requieren_atencion?.length > 0 && (
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-white">
              Sierras que Requieren Atención
            </h3>
          </div>
          <ul className="divide-y divide-gray-700">
            {dashboardData.sierras_requieren_atencion.map((sierra) => (
              <li key={sierra.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-400 truncate">
                      {sierra.codigo}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Requiere atención
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-400">
                        Último afilado: {new Date(sierra.fecha_ultimo_afilado).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                      Cliente: {sierra.cliente?.nombre}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}