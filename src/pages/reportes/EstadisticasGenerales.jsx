// src/pages/reportes/EstadisticasGenerales.jsx
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { reportesService } from '../../services/reportesService';
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
  const { user } = useAuth();
  const { data: estadisticas, isLoading, error } = useQuery({
    queryKey: ['estadisticas'],
    queryFn: reportesService.getEstadisticas,
    enabled: user?.rol === 'GERENTE'
  });

  const { afiladosPorTipo, tendenciaAfilados } = useMemo(() => {
    if (!estadisticas) return { afiladosPorTipo: [], tendenciaAfilados: [] };

    const porTipo = Object.entries(estadisticas.por_tipo_afilado || {}).map(([tipo, cantidad]) => ({
      tipo,
      cantidad,
      name: tipo // para recharts
    }));

    const tendencia = estadisticas.tendencia?.map(item => ({
      fecha: new Date(item.fecha).toLocaleDateString(),
      cantidad: item.cantidad
    })) || [];

    return { afiladosPorTipo: porTipo, tendenciaAfilados: tendencia };
  }, [estadisticas]);

  // ... estados de carga y error ...

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <dt className="text-sm font-medium text-gray-400">Total Afilados</dt>
            <dd className="mt-1 text-3xl font-semibold text-white">
              {estadisticas?.totales?.afilados || 0}
            </dd>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <dt className="text-sm font-medium text-gray-400">Clientes Atendidos</dt>
            <dd className="mt-1 text-3xl font-semibold text-white">
              {estadisticas?.totales?.clientes_atendidos || 0}
            </dd>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <dt className="text-sm font-medium text-gray-400">Sierras Afiladas</dt>
            <dd className="mt-1 text-3xl font-semibold text-white">
              {estadisticas?.totales?.sierras_afiladas || 0}
            </dd>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <dt className="text-sm font-medium text-gray-400">Promedio Diario</dt>
            <dd className="mt-1 text-3xl font-semibold text-white">
              {estadisticas?.promedio_diario?.toFixed(1) || '0'}
            </dd>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <dt className="text-sm font-medium text-gray-400">Período</dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {estadisticas?.periodo ? (
                <>
                  <div>{new Date(estadisticas.periodo.desde).toLocaleDateString()}</div>
                  <div>{new Date(estadisticas.periodo.hasta).toLocaleDateString()}</div>
                </>
              ) : 'No disponible'}
            </dd>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de tendencia */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-white mb-4">
            Tendencia de Afilados
          </h3>
          {tendenciaAfilados.length > 0 ? (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tendenciaAfilados}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="fecha" 
                    stroke="#9CA3AF"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.375rem',
                    }}
                    labelStyle={{ color: '#D1D5DB' }}
                  />
                  <Bar dataKey="cantidad" fill="#4F46E5" name="Cantidad" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <p className="text-gray-400">No hay datos disponibles</p>
            </div>
          )}
        </div>

        {/* Gráfico circular - Tipos de afilado */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-white mb-4">
            Distribución por Tipo de Afilado
          </h3>
          {afiladosPorTipo.length > 0 ? (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={afiladosPorTipo}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="cantidad"
                    nameKey="tipo"
                    label={({ tipo, percent, value }) =>
                      `${tipo} (${value} - ${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {afiladosPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <p className="text-gray-400">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Clientes */}
      {estadisticas?.top_clientes?.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-white mb-4">
            Top Clientes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estadisticas.top_clientes.map((cliente, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 font-medium">{cliente.cliente}</p>
                <p className="text-2xl font-bold text-white">{cliente.cantidad} afilados</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}