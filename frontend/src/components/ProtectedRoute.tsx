import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');

  // Si no hay token, redirigir al login de inmediato
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
