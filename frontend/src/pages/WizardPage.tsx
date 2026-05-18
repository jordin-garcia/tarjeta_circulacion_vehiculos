import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ChevronRight, User, Car, FileCheck, ArrowLeft, Hexagon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useCatalogs, usePropietarios, useVehiculos } from '../api/hooks';

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isNewPropietario, setIsNewPropietario] = useState(false);
  const [isNewVehiculo, setIsNewVehiculo] = useState(false);
  const [searchNit, setSearchNit] = useState('');
  const [searchVin, setSearchVin] = useState('');
  const [searchPropietarioResult, setSearchPropietarioResult] = useState<any>(null);
  const [searchVehiculoResult, setSearchVehiculoResult] = useState<any>(null);
  const [searchError, setSearchError] = useState<{ prop?: string, veh?: string }>({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const catalogs = useCatalogs();
  const { data: dataPropietarios } = usePropietarios();
  const { data: dataVehiculos } = useVehiculos();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    propietario_cui: '',
    propietario_nit: '',
    propietario_nombre: '',
    vehiculo_id_existente: '',
    vehiculo_placa: '',
    vehiculo_marca: '',
    vehiculo_linea: '',
    vehiculo_modelo: '',
    vehiculo_color: '',
    vehiculo_chasis: '',
    vehiculo_motor: '',
    vehiculo_vin: '',
    vehiculo_cilindros: '',
    vehiculo_tonelaje: '',
    vehiculo_asientos: '',
    vehiculo_ejes: '',
    vehiculo_uso: '',
    vehiculo_tipo: '',
    fecha_emision: new Date().toISOString().split('T')[0],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    
    // Propietario validations
    if (name === 'propietario_cui') {
      if (isNewPropietario) {
        if (!value) {
          errorMsg = 'El CUI es requerido';
        } else if (dataPropietarios?.some((p: any) => p.cui_p === value)) {
          errorMsg = 'Este CUI ya está registrado en el sistema';
        }
      }
    } else if (name === 'propietario_nit') {
      if (isNewPropietario) {
        if (!value) {
          errorMsg = 'El NIT es requerido';
        } else if (dataPropietarios?.some((p: any) => p.nit === value)) {
          errorMsg = 'Este NIT ya está registrado en el sistema';
        }
      }
    } else if (name === 'propietario_nombre') {
      if (isNewPropietario && !value) {
        errorMsg = 'El nombre es requerido';
      }
    }
    
    const upperValue = value.toUpperCase();

    // Vehiculo validations
    if (name === 'vehiculo_placa') {
      if (!value) {
        errorMsg = 'La placa es requerida';
      } else if (dataVehiculos?.some((v: any) => v.estado_vehiculo?.some((ev: any) => ev.placa?.toUpperCase() === upperValue))) {
        errorMsg = 'Esta Placa ya está registrada en el sistema';
      }
    } else if (name === 'vehiculo_vin') {
      if (isNewVehiculo) {
        if (!value) {
          errorMsg = 'El VIN es requerido';
        } else if (dataVehiculos?.some((v: any) => v.vin?.toUpperCase() === upperValue)) {
          errorMsg = 'Este VIN ya está registrado en el sistema';
        }
      }
    } else if (name === 'vehiculo_chasis') {
      if (isNewVehiculo) {
        if (!value) {
          errorMsg = 'El chasis es requerido';
        } else if (dataVehiculos?.some((v: any) => v.chasis?.toUpperCase() === upperValue)) {
          errorMsg = 'Este Chasis ya está registrado en el sistema';
        }
      }
    } else if (name === 'vehiculo_modelo') {
      if (isNewVehiculo) {
        if (!value) {
          errorMsg = 'El modelo es requerido';
        } else if (value.length !== 4) {
          errorMsg = 'El modelo debe tener exactamente 4 dígitos (Año)';
        }
      }
    } else if (name === 'vehiculo_motor') {
      if (!value) {
        errorMsg = 'El motor es requerido';
      }
    }
    
    setValidationErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handlePropietarioTypeChange = (isNew: boolean) => {
    setIsNewPropietario(isNew);
    setValidationErrors(prev => {
      const next = { ...prev };
      delete next.propietario_cui;
      delete next.propietario_nit;
      delete next.propietario_nombre;
      return next;
    });
  };

  const handleVehiculoTypeChange = (isNew: boolean) => {
    setIsNewVehiculo(isNew);
    setValidationErrors(prev => {
      const next = { ...prev };
      delete next.vehiculo_vin;
      delete next.vehiculo_chasis;
      delete next.vehiculo_modelo;
      return next;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;

    // Character restrictions and case mapping
    if (name === 'propietario_cui' || name === 'propietario_nit') {
      filteredValue = value.replace(/\D/g, '');
    } else if (name === 'propietario_nombre') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    } else if (name === 'vehiculo_placa' || name === 'vehiculo_vin' || name === 'vehiculo_chasis' || name === 'vehiculo_motor') {
      filteredValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    } else if (name === 'vehiculo_modelo') {
      filteredValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (['vehiculo_cilindros', 'vehiculo_tonelaje', 'vehiculo_asientos', 'vehiculo_ejes'].includes(name)) {
      filteredValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: filteredValue }));
    validateField(name, filteredValue);
  };

  const isStepInvalid = () => {
    if (step === 1) {
      if (isNewPropietario) {
        return (
          !formData.propietario_cui ||
          !formData.propietario_nit ||
          !formData.propietario_nombre ||
          !!validationErrors.propietario_cui ||
          !!validationErrors.propietario_nit ||
          !!validationErrors.propietario_nombre
        );
      } else {
        return !searchPropietarioResult;
      }
    }
    if (step === 2) {
      if (isNewVehiculo) {
        return (
          !formData.vehiculo_placa ||
          !formData.vehiculo_vin ||
          !formData.vehiculo_chasis ||
          !formData.vehiculo_motor ||
          !formData.vehiculo_modelo ||
          formData.vehiculo_modelo.length !== 4 ||
          !formData.vehiculo_marca ||
          !formData.vehiculo_color ||
          !formData.vehiculo_uso ||
          !formData.vehiculo_tipo ||
          !!validationErrors.vehiculo_placa ||
          !!validationErrors.vehiculo_vin ||
          !!validationErrors.vehiculo_chasis ||
          !!validationErrors.vehiculo_motor ||
          !!validationErrors.vehiculo_modelo
        );
      } else {
        return (
          !searchVehiculoResult ||
          !formData.vehiculo_placa ||
          !formData.vehiculo_motor ||
          !formData.vehiculo_color ||
          !formData.vehiculo_uso ||
          !!validationErrors.vehiculo_placa ||
          !!validationErrors.vehiculo_motor
        );
      }
    }
    return false;
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let createdPropietarioNit: string | null = null;
    let createdVehiculoId: number | null = null;
    let createdEstadoId: number | null = null;

    try {
      // 1. Create Propietario
      if (isNewPropietario) {
        await apiClient.post('/propietarios', {
          cui_p: formData.propietario_cui,
          nit: formData.propietario_nit,
          nombre: formData.propietario_nombre,
        });
        createdPropietarioNit = formData.propietario_nit;
      }

      // 2. Create Vehiculo
      let idVehiculo = parseInt(formData.vehiculo_id_existente);
      if (isNewVehiculo) {
        const vehRes = await apiClient.post('/vehiculos', {
          vin: formData.vehiculo_vin,
          chasis: formData.vehiculo_chasis,
          serie: 'N/A', // default
          modelo: parseInt(formData.vehiculo_modelo) || 2024,
          cilindros: parseInt(formData.vehiculo_cilindros) || 4,
          ton: parseInt(formData.vehiculo_tonelaje) || 0,
          asientos: parseInt(formData.vehiculo_asientos) || 5,
          ejes: parseInt(formData.vehiculo_ejes) || 2,
          cc: 1600, // default
          id_linea_fk: parseInt(formData.vehiculo_linea) || 1, // Need to make sure line exists, defaulting to 1
          id_tipo_fk: parseInt(formData.vehiculo_tipo) || 1,
        });
        idVehiculo = vehRes.data.id_vehiculo;
        createdVehiculoId = idVehiculo;
      }

      // 3. Create Estado Vehiculo
      const estRes = await apiClient.post('/estados-vehiculo', {
        placa: formData.vehiculo_placa,
        motor: formData.vehiculo_motor,
        fecha_actualizacion: new Date().toLocaleDateString('en-GB'),
        motivo_cambio: isNewVehiculo ? 'Primera Emisión' : 'Renovación/Reposición',
        id_uso_fk: parseInt(formData.vehiculo_uso) || 1,
        id_color_fk: parseInt(formData.vehiculo_color) || 1,
        id_vehiculo_fk: idVehiculo,
      });
      createdEstadoId = estRes.data.id_estado;

      // 4. Create Tarjeta
      const tarjetaNumero = Math.floor(Math.random() * 90000000) + 10000000;
      const tarjetaCui = `TC-${Math.floor(Math.random() * 900000000)}`;

      const tarjetaRes = await apiClient.post('/tarjetas', {
        numero: tarjetaNumero,
        cui_tc: tarjetaCui,
        fecha_registro: new Date().toLocaleDateString('en-GB'),
        fecha_vencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-GB'),
        fecha_emision: new Date().toLocaleDateString('en-GB'),
        hora_emision: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        estado: true,
        nit_propietario_fk: formData.propietario_nit,
        id_estado_vehiculo_fk: estRes.data.id_estado,
      });

      await queryClient.invalidateQueries({ queryKey: ['tarjetas'] });
      await queryClient.invalidateQueries({ queryKey: ['propietarios'] });
      await queryClient.invalidateQueries({ queryKey: ['vehiculos'] });

      navigate(`/tarjeta/${tarjetaRes.data.numero}`);
    } catch (err: any) {
      console.error('Error during wizard submission', err);

      // Rollback created entities in reverse order of creation
      try {
        if (createdEstadoId) {
          await apiClient.delete(`/estados-vehiculo/${createdEstadoId}`);
        }
      } catch (rollbackErr) {
        console.error('Failed to rollback estado:', rollbackErr);
      }

      try {
        if (createdVehiculoId) {
          await apiClient.delete(`/vehiculos/${createdVehiculoId}`);
        }
      } catch (rollbackErr) {
        console.error('Failed to rollback vehiculo:', rollbackErr);
      }

      try {
        if (createdPropietarioNit) {
          await apiClient.delete(`/propietarios/${createdPropietarioNit}`);
        }
      } catch (rollbackErr) {
        console.error('Failed to rollback propietario:', rollbackErr);
      }

      setError(err.response?.data?.message || 'Error al procesar la emisión de la tarjeta. Verifique los datos ingresados.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Propietario', icon: User },
    { id: 2, title: 'Vehículo', icon: Car },
    { id: 3, title: 'Emisión', icon: FileCheck },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-400 mb-4 transition-colors">
            <ArrowLeft size={16} /> Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Nueva Tarjeta de Circulación</h1>
          <p className="text-gray-400">Asistente de registro paso a paso para emisiones vehiculares.</p>
        </div>

        {/* Stepper */}
        <div className="glass-panel p-6 rounded-2xl mb-8 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-300 -z-10 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-brand-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

          {steps.map((s) => {
            const active = step >= s.id;
            const current = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${active ? 'bg-brand-500 border-brand-500 text-brand-900 shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-surface-200 border-surface-300 text-gray-500'
                  }`}>
                  {step > s.id ? <Check size={20} className="text-brand-900 font-bold" /> : <s.icon size={20} />}
                </div>
                <span className={`mt-2 text-sm font-medium ${current ? 'text-white' : active ? 'text-brand-500' : 'text-gray-500'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="glass-card p-8 min-h-[400px]">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-surface-300 pb-4">Datos del Propietario</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 mb-2 flex flex-col sm:flex-row gap-6 bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                  <label className="flex items-center gap-2 text-white cursor-pointer font-medium hover:text-brand-400 transition-colors">
                    <input type="radio" checked={!isNewPropietario} onChange={() => handlePropietarioTypeChange(false)} className="accent-brand-500 w-4 h-4 cursor-pointer" />
                    Seleccionar Existente
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer font-medium hover:text-brand-400 transition-colors">
                    <input type="radio" checked={isNewPropietario} onChange={() => handlePropietarioTypeChange(true)} className="accent-brand-500 w-4 h-4 cursor-pointer" />
                    Registrar Nuevo
                  </label>
                </div>

                {!isNewPropietario ? (
                  <div className="md:col-span-2 animate-in fade-in duration-300">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Buscar Propietario Existente (NIT)</label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={searchNit}
                        onChange={(e) => setSearchNit(e.target.value)}
                        className="input-field flex-1 bg-surface-100"
                        placeholder="Ej. 12345678"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const prop = dataPropietarios?.find((p: any) => p.nit === searchNit);
                          if (prop) {
                            setSearchPropietarioResult(prop);
                            setSearchError(prev => ({ ...prev, prop: undefined }));
                            setFormData(prev => ({ ...prev, propietario_nit: prop.nit, propietario_nombre: prop.nombre, propietario_cui: prop.cui_p || '' }));
                          } else {
                            setSearchPropietarioResult(null);
                            setSearchError(prev => ({ ...prev, prop: 'No se encontró un propietario con ese NIT' }));
                            setFormData(prev => ({ ...prev, propietario_nit: '', propietario_nombre: '', propietario_cui: '' }));
                          }
                        }}
                        className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-xl transition-colors shadow-lg shadow-brand-500/20"
                      >
                        Buscar
                      </button>
                    </div>
                    {searchError.prop && <p className="text-red-400 text-sm mt-2">{searchError.prop}</p>}
                    {searchPropietarioResult && (
                      <div className="mt-4 p-4 bg-brand-500/10 border border-brand-500/30 rounded-xl animate-in fade-in">
                        <p className="text-brand-400 font-medium mb-1 flex items-center gap-2">
                          <Check className="w-4 h-4" /> Propietario Seleccionado:
                        </p>
                        <p className="text-white font-semibold text-lg">{searchPropietarioResult.nombre}</p>
                        <p className="text-gray-400 text-sm">NIT: <span className="text-gray-200">{searchPropietarioResult.nit}</span> | CUI: <span className="text-gray-200">{searchPropietarioResult.cui_p || 'N/A'}</span></p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">CUI (DPI)</label>
                      <input
                        type="text"
                        name="propietario_cui"
                        value={formData.propietario_cui}
                        onChange={handleChange}
                        className={`input-field ${validationErrors.propietario_cui ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        placeholder="0000 00000 0000"
                      />
                      {validationErrors.propietario_cui && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.propietario_cui}</p>
                      )}
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">NIT</label>
                      <input
                        type="text"
                        name="propietario_nit"
                        value={formData.propietario_nit}
                        onChange={handleChange}
                        className={`input-field ${validationErrors.propietario_nit ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        placeholder="12345678"
                      />
                      {validationErrors.propietario_nit && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.propietario_nit}</p>
                      )}
                    </div>
                    <div className="md:col-span-2 animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Nombre Completo</label>
                      <input
                        type="text"
                        name="propietario_nombre"
                        value={formData.propietario_nombre}
                        onChange={handleChange}
                        className={`input-field ${validationErrors.propietario_nombre ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        placeholder="Ej. Juan Pérez"
                      />
                      {validationErrors.propietario_nombre && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.propietario_nombre}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-surface-300 pb-4">Datos del Vehículo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3 mb-2 flex flex-col sm:flex-row gap-6 bg-surface-200/50 p-4 rounded-xl border border-surface-300">
                  <label className="flex items-center gap-2 text-white cursor-pointer font-medium hover:text-brand-400 transition-colors">
                    <input type="radio" checked={!isNewVehiculo} onChange={() => handleVehiculoTypeChange(false)} className="accent-brand-500 w-4 h-4 cursor-pointer" />
                    Seleccionar Existente
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer font-medium hover:text-brand-400 transition-colors">
                    <input type="radio" checked={isNewVehiculo} onChange={() => handleVehiculoTypeChange(true)} className="accent-brand-500 w-4 h-4 cursor-pointer" />
                    Registrar Nuevo
                  </label>
                </div>

                {!isNewVehiculo ? (
                  <>
                    <div className="md:col-span-3 animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Buscar Vehículo Existente (VIN)</label>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={searchVin}
                          onChange={(e) => setSearchVin(e.target.value)}
                          className="input-field flex-1 bg-surface-100"
                          placeholder="Ej. 1HGCM82633AXXXXXX"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const veh = dataVehiculos?.find((v: any) => v.vin === searchVin);
                            if (veh) {
                              setSearchVehiculoResult(veh);
                              setSearchError(prev => ({ ...prev, veh: undefined }));
                              const latestEstado = veh.estado_vehiculo && veh.estado_vehiculo.length > 0
                                ? veh.estado_vehiculo[veh.estado_vehiculo.length - 1]
                                : null;
                              setFormData(prev => ({
                                ...prev,
                                vehiculo_id_existente: veh.id_vehiculo,
                                vehiculo_placa: latestEstado?.placa || '',
                                vehiculo_motor: latestEstado?.motor || '',
                                vehiculo_uso: latestEstado?.id_uso_fk?.toString() || '',
                                vehiculo_color: latestEstado?.id_color_fk?.toString() || '',
                                vehiculo_vin: veh.vin || ''
                              }));
                            } else {
                              setSearchVehiculoResult(null);
                              setSearchError(prev => ({ ...prev, veh: 'No se encontró un vehículo con ese VIN' }));
                              setFormData(prev => ({
                                ...prev,
                                vehiculo_id_existente: '',
                                vehiculo_placa: '',
                                vehiculo_motor: '',
                                vehiculo_uso: '',
                                vehiculo_color: '',
                                vehiculo_vin: ''
                              }));
                            }
                          }}
                          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-xl transition-colors shadow-lg shadow-brand-500/20"
                        >
                          Buscar
                        </button>
                      </div>
                      {searchError.veh && <p className="text-red-400 text-sm mt-2">{searchError.veh}</p>}
                      {searchVehiculoResult && (
                        <div className="mt-4 p-4 bg-brand-500/10 border border-brand-500/30 rounded-xl animate-in fade-in">
                          <p className="text-brand-400 font-medium mb-1 flex items-center gap-2">
                            <Check className="w-4 h-4" /> Vehículo Seleccionado:
                          </p>
                          <p className="text-white font-semibold text-lg">VIN: {searchVehiculoResult.vin}</p>
                          <p className="text-gray-400 text-sm">Chasis: <span className="text-gray-200">{searchVehiculoResult.chasis}</span></p>
                        </div>
                      )}
                    </div>
                    {/* Campos requeridos para el Estado Vehiculo nuevo */}
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Placa Asignada *</label>
                      <input
                        type="text"
                        name="vehiculo_placa"
                        value={formData.vehiculo_placa}
                        onChange={handleChange}
                        className={`input-field uppercase ${validationErrors.vehiculo_placa ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        placeholder="P000XXX"
                      />
                      {validationErrors.vehiculo_placa && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.vehiculo_placa}</p>
                      )}
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Motor (Actual) *</label>
                      <input
                        type="text"
                        name="vehiculo_motor"
                        value={formData.vehiculo_motor}
                        onChange={handleChange}
                        className={`input-field uppercase ${validationErrors.vehiculo_motor ? 'border-red-500/50 focus:border-red-500' : ''}`}
                      />
                      {validationErrors.vehiculo_motor && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.vehiculo_motor}</p>
                      )}
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Uso *</label>
                      <select name="vehiculo_uso" value={formData.vehiculo_uso} onChange={handleChange} className="input-field bg-surface-100">
                        <option value="">Seleccione...</option>
                        {catalogs.data?.usos?.map((u: any) => <option key={u.id_uso} value={u.id_uso}>{u.uso}</option>)}
                      </select>
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Color Actual *</label>
                      <select name="vehiculo_color" value={formData.vehiculo_color} onChange={handleChange} className="input-field bg-surface-100">
                        <option value="">Seleccione...</option>
                        {catalogs.data?.colores?.map((c: any) => <option key={c.id_color} value={c.id_color}>{c.color}</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Placa *</label>
                      <input
                        type="text"
                        name="vehiculo_placa"
                        value={formData.vehiculo_placa}
                        onChange={handleChange}
                        className={`input-field uppercase ${validationErrors.vehiculo_placa ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        placeholder="P000XXX"
                      />
                      {validationErrors.vehiculo_placa && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.vehiculo_placa}</p>
                      )}
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">VIN *</label>
                      <input
                        type="text"
                        name="vehiculo_vin"
                        value={formData.vehiculo_vin}
                        onChange={handleChange}
                        className={`input-field uppercase ${validationErrors.vehiculo_vin ? 'border-red-500/50 focus:border-red-500' : ''}`}
                      />
                      {validationErrors.vehiculo_vin && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.vehiculo_vin}</p>
                      )}
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Chasis *</label>
                      <input
                        type="text"
                        name="vehiculo_chasis"
                        value={formData.vehiculo_chasis}
                        onChange={handleChange}
                        className={`input-field uppercase ${validationErrors.vehiculo_chasis ? 'border-red-500/50 focus:border-red-500' : ''}`}
                      />
                      {validationErrors.vehiculo_chasis && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.vehiculo_chasis}</p>
                      )}
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Motor *</label>
                      <input
                        type="text"
                        name="vehiculo_motor"
                        value={formData.vehiculo_motor}
                        onChange={handleChange}
                        className={`input-field uppercase ${validationErrors.vehiculo_motor ? 'border-red-500/50 focus:border-red-500' : ''}`}
                      />
                      {validationErrors.vehiculo_motor && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.vehiculo_motor}</p>
                      )}
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Modelo (Año) *</label>
                      <input
                        type="text"
                        name="vehiculo_modelo"
                        value={formData.vehiculo_modelo}
                        onChange={handleChange}
                        className={`input-field ${validationErrors.vehiculo_modelo ? 'border-red-500/50 focus:border-red-500' : ''}`}
                      />
                      {validationErrors.vehiculo_modelo && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.vehiculo_modelo}</p>
                      )}
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Cilindros</label>
                      <input type="text" name="vehiculo_cilindros" value={formData.vehiculo_cilindros} onChange={handleChange} className="input-field" />
                    </div>

                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Marca *</label>
                      <select name="vehiculo_marca" value={formData.vehiculo_marca} onChange={handleChange} className="input-field bg-surface-100">
                        <option value="">Seleccione...</option>
                        {catalogs.data?.marcas?.map((m: any) => <option key={m.id_marca} value={m.id_marca}>{m.marca}</option>)}
                      </select>
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Color *</label>
                      <select name="vehiculo_color" value={formData.vehiculo_color} onChange={handleChange} className="input-field bg-surface-100">
                        <option value="">Seleccione...</option>
                        {catalogs.data?.colores?.map((c: any) => <option key={c.id_color} value={c.id_color}>{c.color}</option>)}
                      </select>
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Uso *</label>
                      <select name="vehiculo_uso" value={formData.vehiculo_uso} onChange={handleChange} className="input-field bg-surface-100">
                        <option value="">Seleccione...</option>
                        {catalogs.data?.usos?.map((u: any) => <option key={u.id_uso} value={u.id_uso}>{u.uso}</option>)}
                      </select>
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Tipo *</label>
                      <select name="vehiculo_tipo" value={formData.vehiculo_tipo} onChange={handleChange} className="input-field bg-surface-100">
                        <option value="">Seleccione...</option>
                        {catalogs.data?.tipos?.map((t: any) => <option key={t.id_tipo} value={t.id_tipo}>{t.tipo}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-surface-300 pb-4">Detalles de Emisión</h2>
              <div className="bg-surface-200/50 p-6 rounded-xl border border-brand-500/20 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Hexagon className="text-brand-500" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-white">NexDrive Validación</h3>
                    <p className="text-brand-500 text-sm">Resumen de la tarjeta a emitir</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Propietario</p>
                    <p className="text-white font-medium truncate">{formData.propietario_nombre || 'No definido'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Placa</p>
                    <p className="text-white font-medium">{formData.vehiculo_placa || 'No definida'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Fecha de Emisión</p>
                    <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Estado</p>
                    <p className="text-green-400 font-medium flex items-center gap-1"><Check size={14} /> Listo</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Al confirmar, se generará la Tarjeta de Circulación digital y se registrará en el sistema central de NexDrive. El documento resultante contará con firma electrónica y código QR de validación.</p>
            </div>
          )}

          {/* Controls */}
          <div className="mt-8 pt-6 border-t border-surface-300 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={step === 1 || loading}
              className="px-6 py-2.5 rounded-xl border border-surface-300 text-gray-300 hover:bg-surface-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Atrás
            </button>

            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={isStepInvalid()}
                className="px-6 py-2.5 rounded-xl bg-brand-500 text-brand-900 font-bold hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-2"
              >
                Siguiente <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || isStepInvalid()}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-blue-500 text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-opacity shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2"
              >
                {loading ? 'Procesando...' : 'Emitir Tarjeta'} <FileCheck size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
