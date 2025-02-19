// src/pages/reportes/ReportesPage.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HistorialSierra } from './HistorialSierra';
import { HistorialCliente } from './HistorialCliente';
import { SierrasCliente } from './SierrasCliente';
import { EstadisticasGenerales } from './EstadisticasGenerales';
import { clientesService } from '../../services/clientesService';
import { sierrasService } from '../../services/sierrasService';
import {
  ChartPieIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const TIPOS_REPORTE = [
  {
    id: 'estadisticas',
    nombre: 'Estadísticas Generales',
    descripcion: 'Ver métricas y estadísticas generales del sistema',
    icon: ChartPieIcon,
  },
  {
    id: 'historial-sierra',
    nombre: 'Historial por Sierra',
    descripcion: 'Consultar el historial completo de afilados por sierra',
    icon: ClipboardDocumentListIcon,
  },
  {
    id: 'historial-cliente',
    nombre: 'Historial por Cliente',
    descripcion: 'Ver todos los servicios realizados para un cliente',
    icon: UserGroupIcon,
  },
  {
    id: 'sierras-cliente',
    nombre: 'Sierras por Cliente',
    descripcion: 'Listar todas las sierras registradas por cliente',
    icon: WrenchScrewdriverIcon,
  },
];

export function ReportesPage() {
  const [tipoReporte, setTipoReporte] = useState('estadisticas');
  const [clienteId, setClienteId] = useState('');
  const [sierraId, setSierraId] = useState('');

  // Cargar clientes
  const { data: clientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: clientesService.getAll,
    select: (data) => data?.filter(cliente => cliente.estado) || []
  });

  // Cargar sierras
  const { data: sierras } = useQuery({
    queryKey: ['sierras'],
    queryFn: sierrasService.getAll,
    select: (data) => data?.filter(sierra => sierra.estado) || []
  });

  const handleTipoReporteChange = (tipo) => {
    setTipoReporte(tipo);
    // Reiniciar selecciones al cambiar de tipo
    if (tipo !== 'historial-sierra') setSierraId('');
    if (tipo !== 'historial-cliente' && tipo !== 'sierras-cliente') setClienteId('');
  };

  const renderReporte = () => {
    switch (tipoReporte) {
      case 'estadisticas':
        return <EstadisticasGenerales />;
      case 'historial-sierra':
        return <HistorialSierra sierraId={sierraId} />;
      case 'historial-cliente':
        return <HistorialCliente clienteId={clienteId} />;
      case 'sierras-cliente':
        return <SierrasCliente clienteId={clienteId} />;
      default:
        return <EstadisticasGenerales />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Reportes</h2>
        <p className="mt-1 text-sm text-gray-400">
          Seleccione el tipo de reporte que desea generar
        </p>
      </div>

      {/* Selector de tipo de reporte */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TIPOS_REPORTE.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => handleTipoReporteChange(tipo.id)}
            className={`relative block rounded-lg border p-4 text-left shadow-sm focus:outline-none ${
              tipoReporte === tipo.id
                ? 'border-indigo-500 ring-2 ring-indigo-500'
                : 'border-gray-700 hover:border-gray-600'
            } bg-gray-800`}
          >
            <div className="flex items-center gap-4">
              <tipo.icon
                className={`h-6 w-6 ${
                  tipoReporte === tipo.id ? 'text-indigo-400' : 'text-gray-400'
                }`}
              />
              <div>
                <p
                  className={`font-medium ${
                    tipoReporte === tipo.id ? 'text-indigo-400' : 'text-gray-300'
                  }`}
                >
                  {tipo.nombre}
                </p>
                <p className="mt-1 text-sm text-gray-400">{tipo.descripcion}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selectores adicionales según el tipo de reporte */}
      {(tipoReporte === 'historial-cliente' || tipoReporte === 'sierras-cliente') && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar Cliente
            </label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            >
              <option value="">Seleccione un cliente</option>
              {clientes?.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {tipoReporte === 'historial-sierra' && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar Sierra
            </label>
            <select
              value={sierraId}
              onChange={(e) => setSierraId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            >
              <option value="">Seleccione una sierra</option>
              {sierras?.map((sierra) => (
                <option key={sierra.id} value={sierra.id}>
                  {sierra.codigo} - {sierra.clientes?.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Contenido del reporte */}
      <div className="mt-6">
        {renderReporte()}
      </div>
    </div>
  );
}