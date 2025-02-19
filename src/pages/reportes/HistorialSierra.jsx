// src/pages/reportes/HistorialSierra.jsx
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { reportesService } from '../../services/reportesService';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#7c3aed', '#2563eb'];
const TIPO_AFILADO_COLORS = {
  'LOMO': 'bg-blue-100 text-blue-800',
  'PECHO': 'bg-yellow-100 text-yellow-800',
  'COMPLETO': 'bg-green-100 text-green-800'
};

export function HistorialSierra({ sierraId }) {
  const { data: historialData, isLoading, error } = useQuery({
    queryKey: ['historial-sierra', sierraId],
    queryFn: () => reportesService.getHistorialSierra(sierraId),
    enabled: !!sierraId
  });

  // Preparar datos para los gráficos usando useMemo
  const { afiladosPorTipo, historialOrdenado } = useMemo(() => {
    if (!historialData?.historial) {
      return { afiladosPorTipo: [], historialOrdenado: [] };
    }

    const porTipo = Object.entries(historialData.resumen.afilados_por_tipo || {}).map(([tipo, cantidad]) => ({
      tipo,
      cantidad,
      name: tipo
    }));

    const historial = [...historialData.historial].sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    return { afiladosPorTipo: porTipo, historialOrdenado: historial };
  }, [historialData]);

  const handleExportPDF = () => {
    const headers = [
      'Fecha',
      'Tipo de Afilado',
      'Operario',
      'Observaciones'
    ];

    const data = historialOrdenado.map(registro => [
      new Date(registro.fecha).toLocaleString(),
      registro.tipo_afilado,
      registro.operario,
      registro.observaciones || '-'
    ]);

    const additionalInfo = {
      'Sierra': historialData.sierra.codigo,
      'Tipo de Sierra': historialData.sierra.tipo_sierra.nombre,
      'Cliente': historialData.sierra.cliente.nombre,
      'Total de Afilados': historialData.resumen.total_afilados,
      'Último Afilado': new Date(historialData.sierra.fecha_ultimo_afilado).toLocaleDateString()
    };

    exportToPDF(
      'Historial de Sierra',
      headers,
      data,
      additionalInfo
    );
  };

  const handleExportExcel = () => {
    const data = historialOrdenado.map(registro => ({
      'Fecha': new Date(registro.fecha).toLocaleString(),
      'Tipo de Afilado': registro.tipo_afilado,
      'Operario': registro.operario,
      'Observaciones': registro.observaciones || '-'
    }));

    exportToExcel('Historial_Sierra', data);
  };

  // Validaciones
  if (!sierraId) {
    return (
      <div className="p-6">
        <p className="text-gray-400 text-center">
          Seleccione una sierra para ver su historial
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
          <p className="text-gray-400">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-400">
          <p>Error al cargar el historial:</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!historialData?.historial?.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400">No hay registros de afilado para esta sierra</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Información de la sierra */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Sierra</p>
            <p className="text-lg font-medium text-white">{historialData.sierra.codigo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Tipo</p>
            <p className="text-lg font-medium text-white">{historialData.sierra.tipo_sierra.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Cliente</p>
            <p className="text-lg font-medium text-white">{historialData.sierra.cliente.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Último Afilado</p>
            <p className="text-lg font-medium text-white">
              {new Date(historialData.sierra.fecha_ultimo_afilado).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Afilados</p>
          <p className="text-2xl font-semibold text-white">{historialData.resumen.total_afilados}</p>
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

      {/* Gráfico de tipos de afilado */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-4">
          Distribución por Tipo de Afilado
        </h3>
        {afiladosPorTipo.length > 0 && (
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
        )}
      </div>

      {/* Tabla de historial */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Fecha
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
            {historialOrdenado.map((registro, index) => (
              <tr key={registro.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(registro.fecha).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${TIPO_AFILADO_COLORS[registro.tipo_afilado]}`}>
                    {registro.tipo_afilado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {registro.operario}
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
  );
}