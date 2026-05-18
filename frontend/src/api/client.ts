import axios from 'axios'

// Instancia base de Axios preconfigurada
const apiClient = axios.create({
    baseURL: 'http://localhost:3000', // URL de tu backend NestJS
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor: agrega automáticamente el token JWT a CADA petición
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default apiClient
