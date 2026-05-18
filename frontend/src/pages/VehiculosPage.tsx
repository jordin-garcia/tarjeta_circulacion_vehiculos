import { useState } from 'react';
import Layout from '../components/Layout';
import { Car, Search, PlusCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVehiculos } from '../api/hooks';

export default function VehiculosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehiculo, setSelectedVehiculo] = useState<any>(null);
  const vehiculos = useVehiculos();

  const filteredVehiculos = vehiculos.data?.filter((v: any) => v.vin.includes(searchTerm)) || [];

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Registro Vehicular</h1>
          <p className="text-gray-400">Inventario y base de datos de todos los vehículos activos.</p>
        </div>
        <Link to="/vehiculos/nuevo" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          <PlusCircle size={20} />
          Registrar Vehículo
        </Link>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-surface-300 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-200/30">
          <div className="flex w-full gap-3">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Buscar por VIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 h-11"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-200/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium border-b border-surface-300">Placa</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Características</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">VIN / Motor</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Uso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-300">
              {vehiculos.isLoading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Cargando parque vehicular...</td></tr>
              ) : filteredVehiculos.length > 0 ? (
                filteredVehiculos.map((veh: any) => (
                  <tr
                    key={veh.id}
                    onClick={() => setSelectedVehiculo(veh)}
                    className="hover:bg-surface-200/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-surface-300 border border-surface-200 rounded-md text-base font-bold tracking-widest text-white shadow-inner">
                        {veh.estado_vehiculo && veh.estado_vehiculo.length > 0 ? veh.estado_vehiculo[0].placa : `ID: ${veh.id_vehiculo}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{veh.linea_vehiculo?.marca_vehiculo?.marca || 'N/A'} {veh.linea_vehiculo?.linea || ''}</p>
                      <p className="text-xs text-gray-400 mt-1">Mod: {veh.modelo || 'N/A'} • Tipo: {veh.tipo_vehiculo?.tipo || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-gray-300">{veh.vin || 'N/A'}</p>
                      <p className="text-xs font-mono text-gray-500 mt-1">Chasis: {veh.chasis || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                        {veh.estado_vehiculo && veh.estado_vehiculo.length > 0 && veh.estado_vehiculo[0].uso_vehiculo ? veh.estado_vehiculo[0].uso_vehiculo.uso : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                    <Car size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No hay vehículos registrados en la base de datos.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalles Vehículo */}
      {selectedVehiculo && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-24 overflow-y-auto">
          <div className="bg-[#05070a] border border-surface-300 rounded-2xl w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden my-4">
            <div className="absolute top-0 left-0 w-full h-32 bg-blue-500/10 blur-[50px] pointer-events-none"></div>

            <div className="flex justify-between items-center p-6 border-b border-surface-300 relative z-10 shrink-0">
              <h2 className="text-xl font-bold text-white">Detalles del Vehículo</h2>
              <button 
                onClick={() => setSelectedVehiculo(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 relative z-10 overflow-y-auto custom-scrollbar space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl font-bold border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Car size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white uppercase">
                    {selectedVehiculo.linea_vehiculo?.marca_vehiculo?.marca || 'N/A'} {selectedVehiculo.linea_vehiculo?.linea || ''}
                  </h3>
                  <p className="text-gray-400 text-sm">Placa: <span className="font-bold text-white">{selectedVehiculo.estado_vehiculo && selectedVehiculo.estado_vehiculo.length > 0 ? selectedVehiculo.estado_vehiculo[0].placa : 'N/A'}</span></p>
                </div>
              </div>

              {/* Sección 1: Datos del Vehículo */}
              <div>
                <h3 className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-3 border-b border-surface-300 pb-1">Datos del Vehículo</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">VIN</p>
                    <p className="text-gray-200 font-mono text-sm break-all">{selectedVehiculo.vin || 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Chasis</p>
                    <p className="text-gray-200 font-mono text-sm break-all">{selectedVehiculo.chasis || 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Serie</p>
                    <p className="text-gray-200 text-sm">{selectedVehiculo.serie || 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Modelo / Año</p>
                    <p className="text-gray-200 text-sm">{selectedVehiculo.modelo || 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Centímetros Cúbicos</p>
                    <p className="text-gray-200 text-sm">{selectedVehiculo.cc ? `${selectedVehiculo.cc} cc` : 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tipo Vehículo</p>
                    <p className="text-gray-200 text-sm">{selectedVehiculo.tipo_vehiculo?.tipo || 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cilindros</p>
                    <p className="text-gray-200 text-sm">{selectedVehiculo.cilindros || 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Asientos</p>
                    <p className="text-gray-200 text-sm">{selectedVehiculo.asientos || 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tonelaje</p>
                    <p className="text-gray-200 text-sm">{selectedVehiculo.ton || '0'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ejes</p>
                    <p className="text-gray-200 text-sm">{selectedVehiculo.ejes || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Sección 2: Estado Actual del Vehículo */}
              <div>
                <h3 className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-3 border-b border-surface-300 pb-1">Estado Actual del Vehículo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Placa</p>
                    <p className="text-gray-200 font-bold text-sm">{selectedVehiculo.estado_vehiculo && selectedVehiculo.estado_vehiculo.length > 0 ? selectedVehiculo.estado_vehiculo[0].placa : 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Motor Actual</p>
                    <p className="text-gray-200 font-mono text-sm break-all">{selectedVehiculo.estado_vehiculo && selectedVehiculo.estado_vehiculo.length > 0 ? selectedVehiculo.estado_vehiculo[0].motor : 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Color Actual</p>
                    <p className="text-gray-200 text-sm">{selectedVehiculo.estado_vehiculo && selectedVehiculo.estado_vehiculo.length > 0 ? selectedVehiculo.estado_vehiculo[0].color?.color : 'N/A'}</p>
                  </div>
                  <div className="bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Uso Registrado</p>
                    <p className="text-blue-400 font-bold text-sm">{selectedVehiculo.estado_vehiculo && selectedVehiculo.estado_vehiculo.length > 0 && selectedVehiculo.estado_vehiculo[0].uso_vehiculo ? selectedVehiculo.estado_vehiculo[0].uso_vehiculo.uso : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
