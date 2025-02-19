// src/pages/reportes/HistorialSierra.jsx
import { useQuery } from '@tanstack/react-query';
import { reportesService } from '../../services/reportesService';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TIPO_AFILADO_COLORS = {
  'LOMO': 'bg-blue-100 text-blue-800',
  'PECHO': 'bg-yellow-100 text-yellow-800',
  'COMPLETO': 'bg-green-100 text-green-800'
};

export function HistorialSierra({ sierraId }) {
  const { data: historial, isLoading, error } = useQuery({
    queryKey: ['historial-sierra', sierraId],
    queryFn: () => reportesService.getHistorialSierra(sierraId),
    enabled: !!sierraId
  });

  // Validaciones iniciales
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

  if (!historial || !historial.registros || historial.registros.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400">No hay registros de afilado para esta sierra</p>
        </div>
      </div>
    );
  }

  // Preparar datos para el gráfico solo si hay registros suficientes
  const tiempoEntreAfilados = historial.registros.length > 1 
    ? historial.registros
        .slice(0, -1)
        .map((registro, index) => {
          const fechaActual = new Date(registro.fecha);
          const fechaSiguiente = new Date(historial.registros[index + 1].fecha);
          const diasDiferencia = Math.round((fechaSiguiente - fechaActual) / (1000 * 60 * 60 * 24));
          
          return {
            fecha: fechaActual.toLocaleDateString(),
            dias: diasDiferencia
          };
        })
    : [];

  const handleExportPDF = () => {
    // Lógica de exportación a PDF
  };

  const handleExportExcel = () => {
    // Lógica de exportación a Excel
  };

  return (
    <div className="p-6 space-y-6">
      {/* Información de la sierra */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Código</p>
            <p className="text-lg font-medium text-white">{historial.sierra?.codigo || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Cliente</p>
            <p className="text-lg font-medium text-white">{historial.sierra?.cliente?.nombre || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Tipo de Sierra</p>
            <p className="text-lg font-medium text-white">{historial.sierra?.tipo_sierra?.nombre || 'N/A'}</p>
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

      {/* Gráfico de tiempo entre afilados */}
      {tiempoEntreAfilados.length > 0 && (
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">
            Tiempo entre Afilados (días)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tiempoEntreAfilados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="fecha" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.375rem',
                  }}
                  labelStyle={{ color: '#D1D5DB' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="dias" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Último Afilado
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {historial.registros.map((registro, index) => (
              <tr key={registro.id || index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(registro.fecha).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${TIPO_AFILADO_COLORS[registro.tipo_afilado]}`}>
                    {registro.tipo_afilado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {registro.usuario?.nombre || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {registro.observaciones || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registro.ultimo_afilado ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Sí
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      No
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}