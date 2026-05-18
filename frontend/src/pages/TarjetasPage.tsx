import { useState } from 'react';
import Layout from '../components/Layout';
import { CreditCard, Search, FileText, Plus, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTarjetas } from '../api/hooks';

export default function TarjetasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const tarjetas = useTarjetas();
  const navigate = useNavigate();

  const filteredTarjetas = tarjetas.data?.filter((t: any) => t.numero.toString().includes(searchTerm)) || [];

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Tarjetas</h1>
          <p className="text-gray-400">Administración general de todas las tarjetas de circulación emitidas.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/wizard" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-brand-900 font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <Plus size={20} />
            Nueva Emisión
          </Link>
        </div>
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
                placeholder="Buscar por número..."
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
                <th className="px-6 py-4 font-medium border-b border-surface-300">No. Tarjeta</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Vehículo (Placa)</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Propietario (CUI)</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Fecha Emisión</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Estado</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-300">
              {tarjetas.isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Cargando registros...</td></tr>
              ) : filteredTarjetas.length > 0 ? (
                filteredTarjetas.map((tarjeta: any) => (
                  <tr 
                    key={tarjeta.numero} 
                    onClick={() => navigate(`/tarjeta/${tarjeta.numero}`)}
                    className="hover:bg-surface-200/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-brand-500 flex items-center gap-2">
                        <CreditCard size={16} className="opacity-50" /> {tarjeta.numero}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-surface-300 rounded text-sm font-bold tracking-widest text-white">
                        {tarjeta.estado_vehiculo?.placa || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{tarjeta.propietario?.cui_p || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {tarjeta.fecha_emision ? new Date(tarjeta.fecha_emision).toLocaleDateString(undefined, { timeZone: 'UTC' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {tarjeta.estado ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Inactiva
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Link to={`/tarjeta/${tarjeta.numero}/gestionar`} title="Gestionar Tarjeta" className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors">
                        <Settings size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No hay tarjetas registradas en el sistema.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-surface-300 flex justify-between items-center text-sm text-gray-400 bg-surface-200/20">
          <span>Total: {filteredTarjetas.length} tarjetas</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-surface-300 hover:bg-surface-200 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1.5 rounded-lg border border-surface-300 hover:bg-surface-200 disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
