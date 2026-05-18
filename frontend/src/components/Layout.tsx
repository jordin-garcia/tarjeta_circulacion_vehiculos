import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Users, Car, Menu, X, LogOut, Hexagon } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tarjetas', path: '/tarjetas', icon: CreditCard },
    { name: 'Propietarios', path: '/propietarios', icon: Users },
    { name: 'Vehículos', path: '/vehiculos', icon: Car },
  ];

  return (
    <div className="h-screen flex bg-[#05070a] overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0 border-r border-surface-300`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-surface-300">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Hexagon className="text-brand-500 w-6 h-6" fill="currentColor" fillOpacity={0.2} />
              <span className="text-xl font-bold text-white tracking-wide">NexDrive</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-brand-500/10 text-brand-500 border border-brand-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-surface-200'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-brand-500' : ''} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-surface-300">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 glass-panel border-b border-surface-300 flex items-center justify-between px-6 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-white">Agente Autorizado</span>
              <span className="text-xs text-brand-500">NexDrive Ops</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-300 border border-brand-500/30 flex items-center justify-center text-brand-500 font-bold shadow-[0_0_10px_rgba(0,229,255,0.2)]">
              OP
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6 md:p-8 relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
          <div className="relative max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
