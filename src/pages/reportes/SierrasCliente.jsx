// src/pages/reportes/SierrasCliente.jsx
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { reportesService } from '../../services/reportesService';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#7c3aed', '#2563eb', '#0891b2'];
const ESTADO_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800'
};

export function SierrasCliente({ clienteId }) {
  const { data: sierrasData, isLoading, error } = useQuery({
    queryKey: ['sierras-cliente', clienteId],
    queryFn: () => reportesService.getSierrasCliente(clienteId),
    enabled: !!clienteId
  });

  // Preparar datos para los gráficos utilizando useMemo
  const { sierrasPorTipo, sierrasPorEstado, datosTabla } = useMemo(() => {
    if (!sierrasData?.sierras) {
      return { sierrasPorTipo: [], sierrasPorEstado: [], datosTabla: [] };
    }

    const porTipo = Object.entries(sierrasData.resumen?.sierras_por_tipo || {})
      .map(([tipo, cantidad]) => ({
        tipo,
        cantidad
      }));

    const porEstado = [
      { 
        name: 'Activas', 
        value: sierrasData.sierras.filter(s => s.estado).length 
      },
      { 
        name: 'Inactivas', 
        value: sierrasData.sierras.filter(s => !s.estado).length 
      }
    ];

    const tabla = sierrasData.sierras.map(sierra => ({
      ...sierra,
      tipo_sierra_nombre: sierra.tipo_sierra?.nombre || 'N/A',
      fecha_ultimo_afilado_formato: sierra.fecha_ultimo_afilado 
        ? new Date(sierra.fecha_ultimo_afilado).toLocaleDateString()
        : '-',
      promedio_dias_formato: sierra.promedio_dias_entre_afilados 
        ? `${sierra.promedio_dias_entre_afilados.toFixed(1)} días`
        : '-'
    }));

    return {
      sierrasPorTipo: porTipo,
      sierrasPorEstado: porEstado,
      datosTabla: tabla
    };
  }, [sierrasData]);

  const handleExportPDF = () => {
    const headers = [
      'Código',
      'Tipo de Sierra',
      'Estado',
      'Último Afilado',
      'Total Afilados',
      'Promedio Días'
    ];

    const data = datosTabla.map(sierra => [
      sierra.codigo,
      sierra.tipo_sierra_nombre,
      sierra.estado ? 'Activa' : 'Inactiva',
      sierra.fecha_ultimo_afilado_formato,
      sierra.total_afilados || 0,
      sierra.promedio_dias_formato
    ]);

    const additionalInfo = {
      'Cliente': sierrasData.cliente?.nombre,
      'Total de Sierras': sierrasData.sierras.length,
      'Sierras Activas': sierrasData.sierras.filter(s => s.estado).length
    };

    exportToPDF(
      'Sierras por Cliente',
      headers,
      data,
      additionalInfo
    );
  };

  const handleExportExcel = () => {
    const data = datosTabla.map(sierra => ({
      'Código': sierra.codigo,
      'Tipo de Sierra': sierra.tipo_sierra_nombre,
      'Estado': sierra.estado ? 'Activa' : 'Inactiva',
      'Último Afilado': sierra.fecha_ultimo_afilado_formato,
      'Total Afilados': sierra.total_afilados || 0,
      'Promedio Días': sierra.promedio_dias_formato
    }));

    exportToExcel('Sierras_Cliente', data);
  };

  // Validaciones
  if (!clienteId) {
    return (
      <div className="p-6">
        <p className="text-gray-400 text-center">
          Seleccione un cliente para ver sus sierras
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
          <p className="text-gray-400">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-400">
          <p>Error al cargar la información:</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!sierrasData?.sierras?.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400">No hay sierras registradas para este cliente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Información del cliente */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Cliente</p>
            <p className="text-lg font-medium text-white">{sierrasData.cliente?.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total de Sierras</p>
            <p className="text-lg font-medium text-white">{sierrasData.sierras.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Sierras Activas</p>
            <p className="text-lg font-medium text-white">
              {sierrasData.sierras.filter(s => s.estado).length}
            </p>
          </div>
        </div>
      </div>

      {/* Botones de exportación */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Exportar PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Exportar Excel
        </button>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Sierras por tipo */}
        {sierrasPorTipo.length > 0 && (
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">
              Sierras por Tipo
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sierrasPorTipo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="tipo" 
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
                  <Bar dataKey="cantidad" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Gráfico circular - Estado de sierras */}
        {sierrasPorEstado.some(item => item.value > 0) && (
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">
              Estado de Sierras
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sierrasPorEstado}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value, percent }) =>
                      `${name} (${value} - ${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {sierrasPorEstado.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de sierras */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Código
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tipo de Sierra
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Último Afilado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Total Afilados
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Promedio Días
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {datosTabla.map((sierra, index) => (
              <tr key={sierra.id || index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-400">
                  {sierra.codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {sierra.tipo_sierra_nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sierra.estado ? ESTADO_COLORS.active : ESTADO_COLORS.inactive
                  }`}>
                    {sierra.estado ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {sierra.fecha_ultimo_afilado_formato}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {sierra.total_afilados || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {sierra.promedio_dias_formato}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}