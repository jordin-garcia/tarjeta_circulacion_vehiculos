# 🚗 NexDrive - Sistema de Gestión de Tarjetas de Circulación (SAT)

NexDrive es un sistema destinado a la gestión, emisión, validación y control de Tarjetas de Circulación Electrónicas en tiempo real. La plataforma cuenta con una arquitectura desacoplada moderna (Backend en NestJS y Frontend en React con Vite), diseñada con un aspecto visual futurista, seguro y de alto rendimiento.

---

## 🎨 Características Destacadas

### 🎴 Tarjeta de Circulación Digital Premium
*   **Diseño High-Fidelity:** Visualización de la tarjeta de circulación con estética de panel translúcido (*glassmorphism*), brillo holográfico azul y marca de agua del logotipo oficial.
*   **Estado en Tiempo Real:** Visualización del estado administrativo directamente en la esquina superior izquierda de la tarjeta en forma de pastilla inteligente (*status pill*):
    *   🟢 **Activa:** Con luz pulsante verde que indica validez legal completa.
    *   🔴 **Inactiva:** Muestra una luz roja y detalla en tiempo real el motivo legal/administrativo de la suspensión (ej. *Impago de Impuesto*, *Reporte de Robo*, *Tarjeta Vencida*).
*   **Descarga Segura:** Generación y descarga directa del documento en formato de imagen de alta fidelidad (PNG) para su almacenamiento local.
*   **Código QR Único:** Cada tarjeta contiene un código QR funcional enlazado al Código Único Identificador (CUI) para validaciones de agentes en carretera.

### 🛡️ Validaciones en Tiempo Real (Instantáneas)
*   **Propietarios:**
    *   **CUI & NIT:** Control estricto de duplicidad en tiempo real en la base de datos a medida que se escribe. Solo se permiten números enteros.
    *   **Nombre:** Validación estricta que permite exclusivamente letras y espacios, bloqueando números o caracteres especiales.
*   **Vehículos:**
    *   **Placa, VIN y Chasis:** Validación instantánea contra registros previos en la base de datos para impedir duplicados accidentales o fraudulentos. Se prohíben caracteres especiales (guiones, símbolos) para mantener la integridad de los datos.
*   **Gestión Administrativa:**
    *   Menú interactivo para cambiar el estado de la tarjeta, solicitando obligatoriamente el motivo de inactivación al desactivarla.
    *   Limpieza automática del motivo de inactivación en la base de datos en caso de que la tarjeta sea reactivada.

---

## 🛠️ Stack Tecnológico

### **Backend (API)**
*   **Framework:** [NestJS](https://nestjs.com/) (Node.js) con TypeScript.
*   **Base de Datos:** PostgreSQL en la nube ([Supabase](https://supabase.com/)).
*   **ORM:** [Prisma](https://www.prisma.io/) (v7).
*   **Seguridad:** Autenticación robusta basada en **JWT** (JSON Web Tokens) y hashing de contraseñas de alta seguridad con **Bcrypt**.
*   **Documentación:** API interactiva auto-documentada con **Swagger** en `/api/docs`.

### **Frontend (Cliente)**
*   **Framework:** [React](https://reactjs.org/) con **Vite**.
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) con el nuevo sistema `@theme` integrado en CSS.
*   **Gestión de Estado:** [TanStack Query](https://tanstack.com/query) (React Query) para sincronización de datos asíncronos y caché inteligente.
*   **Rutas:** [React Router v6](https://reactrouter.com/) con redirección automática y resguardo de seguridad (las rutas del dashboard y gestión redirigen automáticamente al Login si el token JWT no es válido o ha expirado).

---

## 📂 Estructura del Proyecto

```text
tarjeta_circulacion/
├── backend/                  # Servidor API de NestJS
│   ├── prisma/               # Esquema de Prisma y migraciones de Postgres
│   │   └── schema.prisma     # Definición de tablas y relaciones
│   └── src/                  # Código fuente NestJS
│       ├── auth/             # Módulo de Autenticación (JWT + Bcrypt)
│       ├── propietarios/     # Módulo de dueños y validación
│       ├── vehiculos/        # Módulo de automóviles
│       ├── tarjetas/         # Módulo de Tarjetas de Circulación y lógica de estados
│       └── catalogs/         # Módulo de catálogos (Marcas, Líneas, Colores, etc.)
│
├── frontend/                 # Aplicación cliente React
│   ├── public/               # Recursos públicos estáticos
│   └── src/                  # Componentes y Páginas en React
│       ├── api/              # Clientes de Axios y hooks de React Query
│       ├── components/       # Elementos de UI reusables (Layout, Sidebar)
│       └── pages/            # Vistas principales (Dashboard, Tarjeta, Wizard, Login)
│
└── README.md                 # Guía global del proyecto (Este archivo)
```

---

## 🚀 Instalación y Despliegue Local

### **Requisitos Previos**
*   **Node.js** (v18.0 o superior).
*   **npm** (v9.0 o superior).
*   Acceso a base de datos PostgreSQL (Supabase recomendado).

---

### **1. Configuración del Backend**

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Instala las dependencias necesarias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en la raíz de `backend/` con las siguientes credenciales:
    ```env
    DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"
    DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"
    JWT_SECRET="SECRETO_SAT_AGENTE_2026_NEXDRIVE_JWT_KEY_SECURITY"
    PORT=3000
    ```
4.  Genera el cliente de Prisma para cargar los tipos en TypeScript:
    ```bash
    npx prisma generate
    ```
5.  Inicia el servidor de desarrollo con Hot-Reload:
    ```bash
    npm run start:dev
    ```
6.  **Pruebas de la API (Swagger):** Abre tu navegador en `http://localhost:3000/api/docs` para interactuar con todos los endpoints disponibles.

---

### **2. Configuración del Frontend**

1.  Navega a la carpeta del frontend:
    ```bash
    cd ../frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia la aplicación en modo desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre tu navegador en `http://localhost:5173`.

---

## 🔒 Reglas de Negocio y Seguridad

*   **Protección de Rutas (AuthGuard):** Todo endpoint de base de datos (con excepción de `/auth/login` y `/auth/register`) requiere una cabecera de autorización Bearer:
    ```text
    Authorization: Bearer <TOKEN_JWT_AQUÍ>
    ```
*   **Direccionamiento Seguro:** Cualquier intento de acceder al dashboard o gestión de tarjetas sin haber iniciado sesión correctamente redirigirá de inmediato al usuario a la pantalla de `/login`.
*   **Regla de Limpieza:** Al volver a colocar una tarjeta inactiva como **Activa**, el backend limpia de forma segura y automática el campo `motivo_inactivacion` poniéndolo en `null`.

---

## 📄 Licencia

Este proyecto fue desarrollado bajo estrictos lineamientos académicos y profesionales de seguridad para la gestión electrónica vehicular. Todos los derechos reservados © 2026.
