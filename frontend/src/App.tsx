import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import WizardPage from './pages/WizardPage'
import TarjetaPage from './pages/TarjetaPage'
import EditTarjetaPage from './pages/EditTarjetaPage'
import TarjetasPage from './pages/TarjetasPage'
import PropietariosPage from './pages/PropietariosPage'
import VehiculosPage from './pages/VehiculosPage'
import NewPropietarioPage from './pages/NewPropietarioPage'
import NewVehiculoPage from './pages/NewVehiculoPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/wizard" element={<ProtectedRoute><WizardPage /></ProtectedRoute>} />
        <Route path="/tarjeta/:numero" element={<ProtectedRoute><TarjetaPage /></ProtectedRoute>} />
        <Route path="/tarjeta/:numero/gestionar" element={<ProtectedRoute><EditTarjetaPage /></ProtectedRoute>} />
        
        <Route path="/tarjetas" element={<ProtectedRoute><TarjetasPage /></ProtectedRoute>} />
        <Route path="/propietarios" element={<ProtectedRoute><PropietariosPage /></ProtectedRoute>} />
        <Route path="/propietarios/nuevo" element={<ProtectedRoute><NewPropietarioPage /></ProtectedRoute>} />
        <Route path="/vehiculos" element={<ProtectedRoute><VehiculosPage /></ProtectedRoute>} />
        <Route path="/vehiculos/nuevo" element={<ProtectedRoute><NewVehiculoPage /></ProtectedRoute>} />

        {/* Cualquier ruta desconocida redirige al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
