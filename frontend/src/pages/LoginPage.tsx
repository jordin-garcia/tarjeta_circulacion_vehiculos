import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Lock, User, ArrowRight } from 'lucide-react';
import apiClient from '../api/client';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Intentar login real con el backend
      const { data } = await apiClient.post('/auth/login', { username, password });
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Usuario o contraseña incorrectos';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="glass-panel p-8 md:p-10 rounded-3xl relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 bg-surface-100 rounded-2xl border border-surface-300 shadow-[0_0_30px_rgba(0,229,255,0.2)] flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <Hexagon className="w-12 h-12 text-brand-500" />
            </div>
          </div>
          
          <div className="mt-8 mb-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">NexDrive</h1>
            <p className="text-brand-500 font-medium tracking-widest text-sm uppercase">Portal Autorizado</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">
                Identificador de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-11"
                  placeholder="OP-7824"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">
                Clave de Acceso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-brand-900 font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] flex items-center justify-center gap-2 group mt-8 disabled:opacity-70"
            >
              {loading ? (
                'Autenticando...'
              ) : (
                <>
                  Acceder al Sistema
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Acceso restringido a personal autorizado.</p>
            <p>Toda actividad está siendo monitoreada.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
