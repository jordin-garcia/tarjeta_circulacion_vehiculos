import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

// Creamos el cliente de React Query con configuración global
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,                    // Reintentar 2 veces si falla
      staleTime: 1000 * 60 * 5,   // Los datos son "frescos" por 5 minutos
      refetchOnWindowFocus: false, // No re-pedir datos al volver a la pestaña
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
