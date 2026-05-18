import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Car } from 'lucide-react';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useCatalogs, useVehiculos } from '../api/hooks';
import { useQueryClient } from '@tanstack/react-query';

export default function NewVehiculoPage() {
  const navigate = useNavigate();
  const catalogs = useCatalogs();
  const { data: dataVehiculos } = useVehiculos();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    placa: '',
    vin: '',
    chasis: '',
    motor: '',
    serie: 'N/A',
    modelo: '',
    cilindros: '',
    tonelaje: '',
    asientos: '',
    ejes: '',
    marcaId: '',
    lineaId: '',
    colorId: '',
    usoId: '',
    tipoId: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    const upperValue = value.toUpperCase();

    if (name === 'placa') {
      if (!value) {
        errorMsg = 'La placa es requerida';
      } else if (dataVehiculos?.some((v: any) => v.estado_vehiculo?.some((ev: any) => ev.placa?.toUpperCase() === upperValue))) {
        errorMsg = 'Esta Placa ya está registrada en el sistema';
      }
    } else if (name === 'vin') {
      if (!value) {
        errorMsg = 'El VIN es requerido';
      } else if (dataVehiculos?.some((v: any) => v.vin?.toUpperCase() === upperValue)) {
        errorMsg = 'Este VIN ya está registrado en el sistema';
      }
    } else if (name === 'chasis') {
      if (!value) {
        errorMsg = 'El chasis es requerido';
      } else if (dataVehiculos?.some((v: any) => v.chasis?.toUpperCase() === upperValue)) {
        errorMsg = 'Este Chasis ya está registrado en el sistema';
      }
    } else if (name === 'modelo') {
      if (!value) {
        errorMsg = 'El modelo es requerido';
      } else if (value.length !== 4) {
        errorMsg = 'El modelo debe tener exactamente 4 dígitos (Año)';
      }
    } else if (name === 'motor') {
      if (!value) {
        errorMsg = 'El motor es requerido';
      }
    }
    setValidationErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'placa' || name === 'vin' || name === 'chasis' || name === 'motor') {
      // Alphanumeric only, no special characters, uppercase
      filteredValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    } else if (name === 'modelo') {
      // Max 4 integer digits
      filteredValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (['cilindros', 'tonelaje', 'asientos', 'ejes'].includes(name)) {
      // Integer digits only
      filteredValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: filteredValue }));
    validateField(name, filteredValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        vin: formData.vin,
        chasis: formData.chasis,
        serie: formData.serie,
        modelo: parseInt(formData.modelo) || 2024,
        cilindros: parseInt(formData.cilindros) || 4,
        asientos: parseInt(formData.asientos) || 5,
        ejes: parseInt(formData.ejes) || 2,
        cc: 1600, // default
        ton: parseInt(formData.tonelaje) || 0,
        id_linea_fk: parseInt(formData.lineaId) || 1,
        id_tipo_fk: parseInt(formData.tipoId) || 1,
      };

      const vehRes = await apiClient.post('/vehiculos', payload);
      
      try {
        // Also create estado_vehiculo since it's required for the UI
        await apiClient.post('/estados-vehiculo', {
          placa: formData.placa,
          motor: formData.motor,
          fecha_actualizacion: new Date().toLocaleDateString('en-GB'),
          motivo_cambio: 'Registro Inicial',
          id_uso_fk: parseInt(formData.usoId) || 1,
          id_color_fk: parseInt(formData.colorId) || 1,
          id_vehiculo_fk: vehRes.data.id_vehiculo,
        });

        await queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
        navigate('/vehiculos');
      } catch (err: any) {
        // Rollback the created vehicle because the state failed to save!
        await apiClient.delete(`/vehiculos/${vehRes.data.id_vehiculo}`);
        throw err;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = 
    !formData.placa || 
    !formData.vin || 
    !formData.chasis || 
    !formData.motor || 
    !formData.modelo || 
    formData.modelo.length !== 4 ||
    !formData.marcaId ||
    !formData.lineaId ||
    !formData.colorId ||
    !formData.usoId ||
    !formData.tipoId ||
    Object.values(validationErrors).some(err => !!err);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/vehiculos" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-4 transition-colors">
            <ArrowLeft size={16} /> Volver a Vehículos
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Registrar Vehículo</h1>
          <p className="text-gray-400">Complete el formulario para incorporar un nuevo vehículo al parque vehicular.</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sección 1: Identificación */}
            <div>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-surface-300">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                  <Car size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Identificación Principal</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Placa *</label>
                  <input
                    type="text"
                    name="placa"
                    required
                    value={formData.placa}
                    onChange={handleChange}
                    className={`input-field uppercase ${validationErrors.placa ? 'border-red-500/50 focus:border-red-500' : ''}`}
                    placeholder="P000XXX"
                  />
                  {validationErrors.placa && (
                    <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.placa}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">VIN *</label>
                  <input
                    type="text"
                    name="vin"
                    required
                    value={formData.vin}
                    onChange={handleChange}
                    className={`input-field uppercase ${validationErrors.vin ? 'border-red-500/50 focus:border-red-500' : ''}`}
                    placeholder="17 CARACTERES"
                  />
                  {validationErrors.vin && (
                    <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.vin}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Chasis *</label>
                  <input
                    type="text"
                    name="chasis"
                    required
                    value={formData.chasis}
                    onChange={handleChange}
                    className={`input-field uppercase ${validationErrors.chasis ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.chasis && (
                    <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.chasis}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Motor *</label>
                  <input
                    type="text"
                    name="motor"
                    required
                    value={formData.motor}
                    onChange={handleChange}
                    className={`input-field uppercase ${validationErrors.motor ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.motor && (
                    <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.motor}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Modelo (Año) *</label>
                  <input
                    type="text"
                    name="modelo"
                    required
                    value={formData.modelo}
                    onChange={handleChange}
                    className={`input-field ${validationErrors.modelo ? 'border-red-500/50 focus:border-red-500' : ''}`}
                    placeholder="2024"
                  />
                  {validationErrors.modelo && (
                    <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.modelo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección 2: Catálogos */}
            <div>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-surface-300">
                <h2 className="text-xl font-bold text-white">Características (Catálogos)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Marca *</label>
                  <select name="marcaId" required value={formData.marcaId} onChange={handleChange} className="input-field bg-surface-100">
                    <option value="">Seleccione...</option>
                    {catalogs.data?.marcas?.map((m: any) => <option key={m.id_marca} value={m.id_marca}>{m.marca}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Línea *</label>
                  <select name="lineaId" required value={formData.lineaId} onChange={handleChange} className="input-field bg-surface-100">
                    <option value="">Seleccione...</option>
                    {catalogs.data?.lineas?.map((l: any) => <option key={l.id_linea} value={l.id_linea}>{l.linea}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Color *</label>
                  <select name="colorId" required value={formData.colorId} onChange={handleChange} className="input-field bg-surface-100">
                    <option value="">Seleccione...</option>
                    {catalogs.data?.colores?.map((c: any) => <option key={c.id_color} value={c.id_color}>{c.color}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Tipo *</label>
                  <select name="tipoId" required value={formData.tipoId} onChange={handleChange} className="input-field bg-surface-100">
                    <option value="">Seleccione...</option>
                    {catalogs.data?.tipos?.map((t: any) => <option key={t.id_tipo} value={t.id_tipo}>{t.tipo}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Uso *</label>
                  <select name="usoId" required value={formData.usoId} onChange={handleChange} className="input-field bg-surface-100">
                    <option value="">Seleccione...</option>
                    {catalogs.data?.usos?.map((u: any) => <option key={u.id_uso} value={u.id_uso}>{u.uso}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Sección 3: Especificaciones Técnicas */}
            <div>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-surface-300">
                <h2 className="text-xl font-bold text-white">Especificaciones Técnicas</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Cilindros</label>
                  <input type="text" name="cilindros" value={formData.cilindros} onChange={handleChange} className="input-field" placeholder="4" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Tonelaje</label>
                  <input type="text" name="tonelaje" value={formData.tonelaje} onChange={handleChange} className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Asientos</label>
                  <input type="text" name="asientos" value={formData.asientos} onChange={handleChange} className="input-field" placeholder="5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Ejes</label>
                  <input type="text" name="ejes" value={formData.ejes} onChange={handleChange} className="input-field" placeholder="2" />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-300 flex justify-end items-center gap-4">
              <Link
                to="/vehiculos"
                className="px-6 py-2.5 rounded-xl border border-surface-300 text-gray-300 hover:bg-surface-200 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading || isFormInvalid}
                className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? 'Guardando...' : 'Guardar Vehículo'} <Save size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
