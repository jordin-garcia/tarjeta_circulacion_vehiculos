import { useQuery } from '@tanstack/react-query'
import apiClient from './client'

// Hook para obtener todos los catálogos
export function useCatalogs() {
  return useQuery({
    queryKey: ['catalogs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/catalogs')
      return data
    },
  })
}

// Hook para obtener todas las tarjetas
export function useTarjetas() {
  return useQuery({
    queryKey: ['tarjetas'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tarjetas')
      return data
    },
  })
}

// Hook para obtener todos los propietarios
export function usePropietarios() {
  return useQuery({
    queryKey: ['propietarios'],
    queryFn: async () => {
      const { data } = await apiClient.get('/propietarios')
      return data
    },
  })
}

// Hook para obtener todos los vehículos
export function useVehiculos() {
  return useQuery({
    queryKey: ['vehiculos'],
    queryFn: async () => {
      const { data } = await apiClient.get('/vehiculos')
      return data
    },
  })
}
