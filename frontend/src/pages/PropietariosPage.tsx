import { useState } from 'react';
import Layout from '../components/Layout';
import { Users, Search, UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePropietarios } from '../api/hooks';

export default function PropietariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropietario, setSelectedPropietario] = useState<any>(null);
  const propietarios = usePropietarios();

  const filteredPropietarios = propietarios.data?.filter((p: any) => p.nit.includes(searchTerm)) || [];

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Directorio de Propietarios</h1>
          <p className="text-gray-400">Listado completo de personas individuales o jurídicas registradas.</p>
        </div>
        <Link to="/propietarios/nuevo" className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <UserPlus size={20} />
          Nuevo Propietario
        </Link>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-surface-300 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-200/30">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar por NIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 h-11"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-200/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium border-b border-surface-300">Nombre Completo</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">CUI (DPI)</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">NIT</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Vehículos Asignados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-300">
              {propietarios.isLoading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Cargando propietarios...</td></tr>
              ) : filteredPropietarios.length > 0 ? (
                filteredPropietarios.map((prop: any) => (
                  <tr 
                    key={prop.nit} 
                    onClick={() => setSelectedPropietario(prop)}
                    className="hover:bg-surface-200/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                          {prop.nombre.charAt(0)}
                        </div>
                        <span className="font-medium text-white">{prop.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{prop.cui_p || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono">{prop.nit}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold min-w-[2.5rem]">
                        {prop.tarjeta_circulacion ? prop.tarjeta_circulacion.length : 0}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No hay propietarios registrados en el sistema.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalles Propietario */}
      {selectedPropietario && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-24 overflow-y-auto">
          <div className="bg-[#05070a] border border-surface-300 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden my-4">
            <div className="absolute top-0 left-0 w-full h-32 bg-purple-500/10 blur-[50px] pointer-events-none"></div>
            
            <div className="flex justify-between items-center p-6 border-b border-surface-300 relative z-10 shrink-0">
              <h2 className="text-xl font-bold text-white">Detalles del Propietario</h2>
              <button 
                onClick={() => setSelectedPropietario(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 relative z-10 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl font-bold border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  {selectedPropietario.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white uppercase">{selectedPropietario.nombre}</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">NIT</p>
                  <p className="text-gray-200 font-medium">{selectedPropietario.nit || 'N/A'}</p>
                </div>
                <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">CUI (DPI)</p>
                  <p className="text-gray-200 font-medium">{selectedPropietario.cui_p || 'N/A'}</p>
                </div>
                <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300 col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Vehículos Asignados</p>
                  <p className="text-purple-400 font-bold">{selectedPropietario.tarjeta_circulacion ? selectedPropietario.tarjeta_circulacion.length : 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
