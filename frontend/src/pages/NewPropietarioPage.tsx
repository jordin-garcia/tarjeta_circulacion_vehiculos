import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, User } from 'lucide-react';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useQueryClient } from '@tanstack/react-query';
import { usePropietarios } from '../api/hooks';

export default function NewPropietarioPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: propietarios } = usePropietarios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cui: '',
    nit: '',
    nombre: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    if (name === 'cui') {
      if (!value) {
        errorMsg = 'El CUI es requerido';
      } else if (propietarios?.some((p: any) => p.cui_p === value)) {
        errorMsg = 'Este CUI ya está registrado en el sistema';
      }
    } else if (name === 'nit') {
      if (!value) {
        errorMsg = 'El NIT es requerido';
      } else if (propietarios?.some((p: any) => p.nit === value)) {
        errorMsg = 'Este NIT ya está registrado en el sistema';
      }
    } else if (name === 'nombre') {
      if (!value) {
        errorMsg = 'El nombre es requerido';
      }
    }
    setValidationErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'cui' || name === 'nit') {
      // Permit only integer digits
      filteredValue = value.replace(/\D/g, '');
    } else if (name === 'nombre') {
      // Permit only letters and spaces (no numbers or special characters)
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: filteredValue }));
    validateField(name, filteredValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.post('/propietarios', {
        cui_p: formData.cui,
        nit: formData.nit,
        nombre: formData.nombre,
      });
      await queryClient.invalidateQueries({ queryKey: ['propietarios'] });
      navigate('/propietarios');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el propietario');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = 
    !formData.cui || 
    !formData.nit || 
    !formData.nombre || 
    Object.values(validationErrors).some(err => !!err);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/propietarios" className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 mb-4 transition-colors">
            <ArrowLeft size={16} /> Volver a Propietarios
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Nuevo Propietario</h1>
          <p className="text-gray-400">Ingrese los datos para registrar a un nuevo individuo o empresa.</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-surface-300">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                <User size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Datos Personales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">CUI (DPI) *</label>
                <input
                  type="text"
                  name="cui"
                  required
                  value={formData.cui}
                  onChange={handleChange}
                  className={`input-field ${validationErrors.cui ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="0000 00000 0000"
                />
                {validationErrors.cui && (
                  <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.cui}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">NIT *</label>
                <input
                  type="text"
                  name="nit"
                  required
                  value={formData.nit}
                  onChange={handleChange}
                  className={`input-field ${validationErrors.nit ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="12345678"
                />
                {validationErrors.nit && (
                  <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.nit}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Nombre Completo / Razón Social *</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`input-field ${validationErrors.nombre ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="Ej. Juan Pérez"
                />
                {validationErrors.nombre && (
                  <p className="text-red-400 text-xs mt-1.5 pl-1 animate-in fade-in">{validationErrors.nombre}</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-300 flex justify-end items-center gap-4">
              <Link
                to="/propietarios"
                className="px-6 py-2.5 rounded-xl border border-surface-300 text-gray-300 hover:bg-surface-200 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading || isFormInvalid}
                className="px-8 py-2.5 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? 'Guardando...' : 'Guardar Propietario'} <Save size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
