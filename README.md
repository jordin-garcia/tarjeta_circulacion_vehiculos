# 🚗 Sistema de Gestión de Tarjetas de Circulación (SAT)

Este proyecto es una solución integral para la gestión y emisión de tarjetas de circulación de vehículos, desarrollada como una aplicación web moderna con arquitectura desacoplada (Backend + Frontend).

## 🛠️ Tecnologías Utilizadas

### **Backend**
*   **Framework:** [NestJS](https://nestjs.com/) (Node.js)
*   **Base de Datos:** PostgreSQL alojado en [Supabase](https://supabase.com/).
*   **ORM:** [Prisma](https://www.prisma.io/) (v7).
*   **Seguridad:** Autenticación con **JWT** (JSON Web Tokens) y cifrado de contraseñas con **Bcrypt**.
*   **Documentación:** API documentada interactivamente con **Swagger**.

### **Frontend** (En desarrollo)
*   **Framework:** [React](https://reactjs.org/) con **Vite**.
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/).
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/).

---

## 📂 Estructura del Proyecto

```text
tarjeta_circulacion/
├── backend/          # Servidor NestJS y lógica de negocio
│   ├── prisma/       # Esquema de base de datos y migraciones
│   └── src/          # Código fuente del API
├── frontend/         # Aplicación cliente en React (Vite)
└── .gitignore        # Configuración de archivos excluidos de Git
```

---

## 🚀 Configuración y Ejecución

### **1. Requisitos Previos**
*   Node.js (v18 o superior).
*   Una instancia de PostgreSQL (recomendado Supabase).

### **2. Backend**
1. Entra a la carpeta: `cd backend`
2. Instala dependencias: `npm install`
3. Configura las variables de entorno en un archivo `.env`:
   ```env
   DATABASE_URL="tu_url_de_supabase"
   DIRECT_URL="tu_url_directa_de_supabase"
   JWT_SECRET="SECRETO_SAT_2026"
   ```
4. Genera el cliente de Prisma: `npx prisma generate`
5. Inicia el servidor: `npm run start:dev`
6. **Documentación:** Una vez corriendo, accede a `http://localhost:3000/api/docs` para probar los endpoints.

### **3. Frontend**
1. Entra a la carpeta: `cd frontend`
2. Instala dependencias: `npm install`
3. Inicia la aplicación: `npm run dev`

---

## 🔒 Seguridad
La API utiliza un sistema de **Guardias (AuthGuard)**. Para realizar operaciones en el módulo de `Tarjetas`, es necesario:
1. Registrarse en `POST /auth/register`.
2. Iniciar sesión en `POST /auth/login` para obtener un Token.
3. Incluir el token en el encabezado de las peticiones: `Authorization: Bearer <TOKEN>`.

---

## 📄 Licencia
Este proyecto fue desarrollado con fines académicos.
