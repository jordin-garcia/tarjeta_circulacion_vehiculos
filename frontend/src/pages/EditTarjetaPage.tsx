import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Paintbrush, Power, Save, FileEdit, AlertTriangle, User } from 'lucide-react';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useTarjetas, useCatalogs, usePropietarios } from '../api/hooks';
import { useQueryClient } from '@tanstack/react-query';

export default function EditTarjetaPage() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dominio' | 'caracteristicas' | 'estado'>('dominio');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch data
  const { data: tarjetas, isLoading: loadingTarjetas } = useTarjetas();
  const catalogs = useCatalogs();
  const propietarios = usePropietarios();

  const tarjeta = tarjetas?.find((t: any) => t.numero.toString() === numero) || null;

  // Forms state
  const [dominioData, setDominioData] = useState({ nuevoNit: '' });
  const [caracData, setCaracData] = useState({ nuevoMotor: '', nuevoColorId: '' });
  const [estadoData, setEstadoData] = useState({ activo: true, motivo: '' });

  const queryClient = useQueryClient();

  // Initialize data when tarjeta loads
  useEffect(() => {
    if (tarjeta) {
      setCaracData({
        nuevoMotor: tarjeta.estado_vehiculo?.motor || '',
        nuevoColorId: tarjeta.estado_vehiculo?.id_color_fk?.toString() || '',
      });
      setEstadoData({
        activo: tarjeta.estado ?? true,
        motivo: tarjeta.motivo_inactivacion || '',
      });
    }
  }, [tarjeta]);

  const handleUpdate = async (type: string, data: any) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (type === 'dominio') {
        await apiClient.patch(`/tarjetas/${numero}`, { nit_propietario_fk: data.nuevoNit });
      } else if (type === 'caracteristicas') {
        await apiClient.patch(`/estados-vehiculo/${tarjeta.id_estado_vehiculo_fk}`, {
          motor: data.nuevoMotor || undefined,
          id_color_fk: data.nuevoColorId ? parseInt(data.nuevoColorId) : undefined,
        });
      } else if (type === 'estado') {
        await apiClient.patch(`/tarjetas/${numero}`, {
          estado: data.activo,
          motivo_inactivacion: data.activo ? null : data.motivo
        });
      }
      setSuccess('La tarjeta ha sido actualizada exitosamente.');
      await queryClient.invalidateQueries({ queryKey: ['tarjetas'] });
      setTimeout(() => navigate('/tarjetas'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la tarjeta. Verifica que los datos sean correctos.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingTarjetas) {
    return <Layout><div className="text-center py-20 text-gray-500">Cargando datos de la tarjeta...</div></Layout>;
  }

  if (!tarjeta) {
    return (
      <Layout>
        <div className="text-center py-20">
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Tarjeta no encontrada</h2>
          <Link to="/tarjetas" className="text-brand-500 hover:underline">Volver al listado</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/tarjetas" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-400 mb-4 transition-colors">
              <ArrowLeft size={16} /> Volver a Tarjetas
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileEdit className="text-brand-500" /> Gestionar Tarjeta {numero}
            </h1>
            <p className="text-gray-400 mt-2">Placa actual: <span className="font-bold text-white">{tarjeta.estado_vehiculo?.placa || 'N/A'}</span></p>
          </div>
          <Link to={`/tarjeta/${numero}`} className="px-4 py-2 bg-surface-200 hover:bg-surface-300 text-white rounded-lg border border-surface-300 transition-colors">
            Ver Tarjeta Digital
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
            {success}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabs Sidebar */}
          <div className="w-full md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('dominio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium ${activeTab === 'dominio' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-surface-200 text-gray-400 hover:bg-surface-300'
                }`}
            >
              <User size={18} /> Traspaso de Dominio
            </button>
            <button
              onClick={() => setActiveTab('caracteristicas')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium ${activeTab === 'caracteristicas' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]' : 'bg-surface-200 text-gray-400 hover:bg-surface-300'
                }`}
            >
              <Paintbrush size={18} /> Características
            </button>
            <button
              onClick={() => setActiveTab('estado')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium ${activeTab === 'estado' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'bg-surface-200 text-gray-400 hover:bg-surface-300'
                }`}
            >
              <Power size={18} /> Estado Administrativo
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 glass-card p-6 md:p-8">
            {activeTab === 'dominio' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-white mb-4">Traspaso de Dominio</h2>
                <p className="text-gray-400 text-sm mb-6">Realiza el cambio de dueño legal del vehículo. Selecciona el nuevo propietario del directorio existente.</p>

                <div className="bg-surface-200/50 p-4 rounded-xl mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Propietario Actual</p>
                  <p className="text-white font-medium">{tarjeta.propietario?.nombre || 'Desconocido'} (NIT: {tarjeta.propietario?.nit})</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdate('dominio', dominioData); }}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Nuevo Propietario (NIT o Nombre) *</label>
                    <select
                      required
                      value={dominioData.nuevoNit}
                      onChange={(e) => setDominioData({ nuevoNit: e.target.value })}
                      className="input-field bg-surface-100"
                    >
                      <option value="">Seleccione el nuevo propietario...</option>
                      {propietarios.data?.map((p: any) => (
                        <option key={p.nit} value={p.nit}>{p.nombre} - NIT: {p.nit}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={loading || !dominioData.nuevoNit} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-2">
                      <Save size={18} /> Ejecutar Traspaso
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'caracteristicas' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-white mb-4">Actualizar Características</h2>
                <p className="text-gray-400 text-sm mb-6">Aplica cambios físicos al vehículo como reemplazo de motor o cambio de color.</p>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdate('caracteristicas', caracData); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Número de Motor</label>
                      <input
                        type="text"
                        value={caracData.nuevoMotor}
                        onChange={(e) => setCaracData({ ...caracData, nuevoMotor: e.target.value })}
                        className="input-field uppercase"
                        placeholder="Ej. M-123456"
                      />
                      <p className="text-xs text-gray-500 mt-2">Motor actual: {tarjeta.estado_vehiculo?.motor || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Color del Vehículo</label>
                      <select
                        value={caracData.nuevoColorId}
                        onChange={(e) => setCaracData({ ...caracData, nuevoColorId: e.target.value })}
                        className="input-field bg-surface-100"
                      >
                        <option value="">Mantener color actual</option>
                        {catalogs.data?.colores?.map((c: any) => (
                          <option key={c.id_color} value={c.id_color}>{c.color}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-brand-500 hover:bg-brand-600 text-brand-900 font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-2">
                      <Save size={18} /> Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'estado' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-white mb-4">Estado Administrativo</h2>
                <p className="text-gray-400 text-sm mb-6">Desactiva la tarjeta por motivos administrativos o legales (impago, vencimiento).</p>

                <div className={`p-4 rounded-xl border mb-6 flex items-center justify-between ${estadoData.activo ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estado Actual</p>
                    <p className={`font-bold ${estadoData.activo ? 'text-green-400' : 'text-red-400'}`}>
                      {estadoData.activo ? 'ACTIVA Y VIGENTE' : 'INACTIVA'}
                    </p>
                  </div>
                  <Power size={24} className={estadoData.activo ? 'text-green-400' : 'text-red-400'} />
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdate('estado', estadoData); }}>
                  <div className="mb-6 space-y-4">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-surface-300 bg-surface-200/50 cursor-pointer hover:bg-surface-200 transition-colors">
                      <input
                        type="radio"
                        name="estado"
                        checked={estadoData.activo === true}
                        onChange={() => setEstadoData({ ...estadoData, activo: true, motivo: '' })}
                        className="w-5 h-5 accent-brand-500"
                      />
                      <div>
                        <p className="text-white font-medium">Activa</p>
                        <p className="text-xs text-gray-400">La tarjeta opera con normalidad.</p>
                      </div>
                    </label>

                    <label className="flex flex-col gap-3 p-4 rounded-xl border border-surface-300 bg-surface-200/50 cursor-pointer hover:bg-surface-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="estado"
                          checked={estadoData.activo === false}
                          onChange={() => setEstadoData({ ...estadoData, activo: false })}
                          className="w-5 h-5 accent-yellow-500"
                        />
                        <div>
                          <p className="text-white font-medium">Inactiva</p>
                          <p className="text-xs text-gray-400">Suspender validez legal del documento.</p>
                        </div>
                      </div>

                      {!estadoData.activo && (
                        <div className="pl-8 pt-3 mt-1 border-t border-surface-300">
                          <label className="block text-sm text-gray-400 mb-2">Motivo de desactivación *</label>
                          <select
                            required={!estadoData.activo}
                            value={estadoData.motivo}
                            onChange={(e) => setEstadoData({ ...estadoData, motivo: e.target.value })}
                            className="input-field bg-surface-100"
                          >
                            <option value="">Seleccione un motivo...</option>
                            <option value="impago">Impago de Impuesto de Circulación</option>
                            <option value="vencimiento">Tarjeta Vencida</option>
                            <option value="robo">Reporte de Robo</option>
                            <option value="inactivacion_definitiva">Inactivación Definitiva</option>
                          </select>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2">
                      <Save size={18} /> Confirmar Estado
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
