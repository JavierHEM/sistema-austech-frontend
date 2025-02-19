// src/pages/reportes/EstadisticasGenerales.jsx
import { useQuery } from '@tanstack/react-query';
import { reportesService } from '../../services/reportesService';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#7c3aed', '#2563eb'];

export function EstadisticasGenerales() {
  const { data: estadisticas, isLoading, error } = useQuery({
    queryKey: ['estadisticas'],
    queryFn: () => reportesService.getEstadisticas()
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
          <p className="text-gray-400">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-400">
          <p>Error al cargar las estadísticas</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  // Si no hay datos
  if (!estadisticas) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400">No hay datos estadísticos disponibles</p>
        </div>
      </div>
    );
  }

  // Preparar los datos seguros para los gráficos
  const datos = {
    totalSierras: estadisticas.total_sierras || 0,
    sierrasActivas: estadisticas.sierras_activas || 0,
    totalAfilados: estadisticas.total_afilados || 0,
    afiladosMes: estadisticas.afilados_mes || 0,
    promedioMensual: estadisticas.promedio_mensual ? Number(estadisticas.promedio_mensual).toFixed(1) : '0'
  };

  // Datos para el gráfico de barras
  const datosMensuales = estadisticas.afilados_por_mes 
    ? Object.entries(estadisticas.afilados_por_mes).map(([mes, cantidad]) => ({
        mes,
        cantidad
      }))
    : [];

  // Datos para el gráfico circular
  const datosTipos = estadisticas.afilados_por_tipo 
    ? Object.entries(estadisticas.afilados_por_tipo).map(([tipo, cantidad]) => ({
        tipo,
        cantidad
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-white">
                  {datos.totalSierras}
                </div>
                <p className="mt-1 text-sm text-gray-400">Total Sierras</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-white">
                  {datos.sierrasActivas}
                </div>
                <p className="mt-1 text-sm text-gray-400">Sierras Activas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-white">
                  {datos.totalAfilados}
                </div>
                <p className="mt-1 text-sm text-gray-400">Total Afilados</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-white">
                  {datos.afiladosMes}
                </div>
                <p className="mt-1 text-sm text-gray-400">Afilados del Mes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-white">
                  {datos.promedioMensual}
                </div>
                <p className="mt-1 text-sm text-gray-400">Promedio Mensual</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Afilados por mes */}
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">
            Afilados por Mes 
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosMensuales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.375rem',
                  }}
                  labelStyle={{ color: '#D1D5DB' }}
                />
                <Bar dataKey="cantidad" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico circular - Tipos de afilado */}
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">
            Distribución por Tipo de Afilado
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosTipos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="cantidad"
                  label={({ tipo, percent }) =>
                    `${tipo} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {datosTipos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}