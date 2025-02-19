// src/pages/reportes/HistorialCliente.jsx
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
  Legend,
  ResponsiveContainer,
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

export function HistorialCliente({ clienteId }) {
  const { data: historialData, isLoading, error } = useQuery({
    queryKey: ['historial-cliente', clienteId],
    queryFn: () => reportesService.getHistorialCliente(clienteId),
    enabled: !!clienteId
  });

  const { afiladosPorTipo, todosLosAfilados } = useMemo(() => {
    if (!historialData?.resumen) {
      return { afiladosPorTipo: [], todosLosAfilados: [] };
    }

    // Datos para el gráfico de tipos de afilado
    const porTipo = Object.entries(historialData.resumen.afilados_por_tipo || {}).map(([tipo, cantidad]) => ({
      tipo,
      cantidad,
      name: tipo
    }));

    // Consolidar todos los afilados de todas las sierras
    const todosAfilados = historialData.sierras.flatMap(sierra => 
      sierra.historial.map(afilado => ({
        ...afilado,
        sierra_codigo: sierra.codigo,
        tipo_sierra: sierra.tipo_sierra.nombre
      }))
    ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return { afiladosPorTipo: porTipo, todosLosAfilados: todosAfilados };
  }, [historialData]);

  const handleExportPDF = () => {
    const headers = [
      'Fecha',
      'Sierra',
      'Tipo de Sierra',
      'Tipo de Afilado',
      'Operario',
      'Observaciones'
    ];

    const data = todosLosAfilados.map(registro => [
      new Date(registro.fecha).toLocaleString(),
      registro.sierra_codigo,
      registro.tipo_sierra,
      registro.tipo_afilado,
      registro.operario,
      registro.observaciones || '-'
    ]);

    const additionalInfo = {
      'Cliente': historialData.cliente.nombre,
      'Dirección': historialData.cliente.direccion,
      'Teléfono': historialData.cliente.telefono,
      'Total Sierras': historialData.resumen.total_sierras,
      'Total Afilados': historialData.resumen.total_afilados
    };

    exportToPDF(
      'Historial de Cliente',
      headers,
      data,
      additionalInfo
    );
  };

  const handleExportExcel = () => {
    const data = todosLosAfilados.map(registro => ({
      'Fecha': new Date(registro.fecha).toLocaleString(),
      'Sierra': registro.sierra_codigo,
      'Tipo de Sierra': registro.tipo_sierra,
      'Tipo de Afilado': registro.tipo_afilado,
      'Operario': registro.operario,
      'Observaciones': registro.observaciones || '-'
    }));

    exportToExcel('Historial_Cliente', data);
  };

  // Validaciones
  if (!clienteId) {
    return (
      <div className="p-6">
        <p className="text-gray-400 text-center">
          Seleccione un cliente para ver su historial
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

  if (!historialData?.sierras?.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400">No hay registros de afilado para este cliente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Información del cliente */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Cliente</p>
            <p className="text-lg font-medium text-white">{historialData.cliente.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Dirección</p>
            <p className="text-lg font-medium text-white">{historialData.cliente.direccion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Teléfono</p>
            <p className="text-lg font-medium text-white">{historialData.cliente.telefono}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Sierras</p>
            <p className="text-lg font-medium text-white">{historialData.resumen.total_sierras}</p>
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
                Sierra
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tipo de Sierra
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
            {todosLosAfilados.map((registro, index) => (
              <tr key={registro.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(registro.fecha).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-400">
                  {registro.sierra_codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {registro.tipo_sierra}
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