import { useState } from 'react';
import { FileText, Car, Users } from 'lucide-react';
import { useTarjetas, usePropietarios, useVehiculos } from '../api/hooks';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [] = useState('');

  const tarjetas = useTarjetas();
  const propietarios = usePropietarios();
  const vehiculos = useVehiculos();

  const stats = [
    { label: 'Tarjetas Registradas', value: tarjetas.data?.length ?? 0, icon: FileText, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Vehículos Registrados', value: vehiculos.data?.length ?? 0, icon: Car, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Propietarios Registrados', value: propietarios.data?.length ?? 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Control</h1>
          <p className="text-gray-400">Resumen de registros y gestión de circulación vehicular.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 flex items-start gap-4 group">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white">
                {(tarjetas.isLoading || vehiculos.isLoading || propietarios.isLoading) ? '...' : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-surface-300 flex justify-between items-center bg-surface-200/30">
          <h2 className="text-xl font-bold text-white">Registros Recientes</h2>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-200/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium border-b border-surface-300">No. Tarjeta</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Placa</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Propietario (CUI)</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Fecha Emisión</th>
                <th className="px-6 py-4 font-medium border-b border-surface-300">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-300">
              {tarjetas.isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Cargando registros...
                  </td>
                </tr>
              ) : tarjetas.data && tarjetas.data.length > 0 ? (
                tarjetas.data.map((tarjeta: any) => (
                  <tr
                    key={tarjeta.numero}
                    onClick={() => navigate(`/tarjeta/${tarjeta.numero}`)}
                    className="hover:bg-surface-200/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-brand-500">{tarjeta.numero}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-surface-300 rounded text-sm font-bold tracking-widest text-white">
                        {tarjeta.estado_vehiculo?.placa || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {tarjeta.propietario?.cui_p || 'N/A'}
                    </td>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No hay tarjetas registradas aún.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-surface-300 flex justify-between items-center text-sm text-gray-400">
          <span>Mostrando {tarjetas.data?.length || 0} registros</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-surface-300 hover:bg-surface-200 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 rounded border border-surface-300 hover:bg-surface-200 disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
