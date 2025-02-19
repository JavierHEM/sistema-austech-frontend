// src/components/QuickSearch.jsx
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { sierrasService } from '../services/sierrasService';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { QuickSierraForm } from './QuickSierraForm';
import { HistorialForm } from '../pages/historial/HistorialForm';

export function QuickSearch() {
  const [searchCode, setSearchCode] = useState('');
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [showHistorialForm, setShowHistorialForm] = useState(false);
  const [selectedSierra, setSelectedSierra] = useState(null);

  const searchMutation = useMutation({
    mutationFn: async (codigo) => {
      try {
        const data = await sierrasService.search(codigo);
        return data;
      } catch (error) {
        console.error('Error searching sierra:', error);
        return null;
      }
    },
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setSelectedSierra(data[0]);
        setShowHistorialForm(true);
      } else {
        setShowQuickForm(true);
      }
      setSearchCode('');
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCode.trim()) {
      searchMutation.mutate(searchCode);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Buscar sierra por código..."
          />
        </div>
        <button
          type="submit"
          disabled={searchMutation.isLoading || !searchCode.trim()}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searchMutation.isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buscando...
            </div>
          ) : (
            'Buscar'
          )}
        </button>
      </form>

      {/* Formulario rápido para nueva sierra */}
      {showQuickForm && (
        <QuickSierraForm
          initialCode={searchCode}
          onClose={() => setShowQuickForm(false)}
          onSuccess={(sierra) => {
            setSelectedSierra(sierra);
            setShowQuickForm(false);
            setShowHistorialForm(true);
          }}
        />
      )}

      {/* Formulario de historial para sierra encontrada */}
      {showHistorialForm && selectedSierra && (
        <HistorialForm
          sierra={selectedSierra}
          onClose={() => {
            setShowHistorialForm(false);
            setSelectedSierra(null);
          }}
        />
      )}
    </div>
  );
}