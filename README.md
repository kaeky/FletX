# Proyecto de Gestión de Compañías

Este proyecto es una aplicación full stack que consta de un backend en NestJS y un frontend en Angular. Permite gestionar compañías, productos y usuarios con un sistema completo de autenticación y control de acceso basado en roles.

## Estructura del Proyecto

- **backend/**: API RESTful desarrollada en NestJS con TypeORM y PostgreSQL
- **frontend/**: Aplicación SPA desarrollada en Angular 17 con enfoque standalone components

## Requisitos Previos

- Node.js (v22 o superior)
- npm (v9 o superior)
- PostgreSQL (v13 o superior)
- Git

## Backend (NestJS)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/kaeky/FletX

# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install
```

### Configuración del Entorno

Crea un archivo `.env` en la raíz del directorio backend con las siguientes variables:

```
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=company_management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

### Configuración de la Base de Datos

```bash
# Crear la base de datos en PostgreSQL
Crear de manera manual la base de datos en PostgreSQL o usar un cliente como pgAdmin.

# Ejecutar migraciones
npm run migration:run

```

### Iniciar el Servidor

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El backend estará disponible en http://localhost:3000/api.

### Estructura de Carpetas del Backend

```
backend/
├── src/
│   ├── main.ts                   # Punto de entrada principal
│   ├── app.module.ts             # Módulo principal
│   ├── auth/                     # Autenticación y autorización
│   ├── users/                    # Gestión de usuarios
│   ├── companies/                # Gestión de compañías
│   ├── products/                 # Gestión de productos
│   ├── departments/              # Datos de departamentos
│   ├── cities/                   # Datos de ciudades
│   ├── common/                   # Componentes comunes (guards, interceptors)
│   └── config/                   # Configuración de la aplicación
├── test/                         # Pruebas
├── data/                         # Datos de carga inicial (JSON)
├── .env                          # Variables de entorno
└── README.md                     # Documentación
```

### API Endpoints

La documentación completa de los endpoints está disponible en la colección de Postman: https://www.postman.com/test11-6174/workspace/fletx

#### Principales Endpoints

| Método | Ruta | Descripción | Permisos |
|--------|------|-------------|----------|
| POST | /api/auth/login | Iniciar sesión | Público |
| POST | /api/auth/register | Registrar nuevo usuario | Público |
| GET | /api/users | Obtener todos los usuarios | Admin |
| GET | /api/companies | Obtener compañías (filtradas por rol) | Autenticado |
| GET | /api/products | Obtener productos (filtrados por rol) | Autenticado |
| GET | /api/departments | Obtener departamentos | Autenticado |
| GET | /api/cities | Obtener ciudades | Autenticado |

para mas details consulta la colección de Postman.
https://www.postman.com/test11-6174/workspace/fletx
## Frontend (Angular)

### Instalación

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install
```

### Configuración del Entorno

El frontend utiliza archivos de entorno para configurar la conexión con el backend. Revisa y ajusta si es necesario:

```typescript
// src/environments/environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// src/environments/environment.prod.ts (producción)
export const environment = {
  production: true,
  apiUrl: 'https://api.tudominio.com/api'
};
```

### Iniciar la Aplicación

```bash
# Modo desarrollo
ng serve

# Construcción para producción
ng build --configuration production
```

La aplicación estará disponible en http://localhost:4200.

### Estructura de Carpetas del Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Componente principal
│   │   ├── app.routes.ts          # Configuración de rutas principal
│   │   ├── app.config.ts          # Configuración de la aplicación
│   │   ├── core/                  # Servicios, modelos y guards básicos
│   │   │   ├── guards/            # Guards para proteger rutas
│   │   │   ├── interceptors/      # Interceptores HTTP
│   │   │   ├── models/            # Interfaces de datos
│   │   │   └── services/          # Servicios para comunicación con API
│   │   ├── features/              # Módulos funcionales
│   │   │   ├── auth/              # Autenticación (login/registro)
│   │   │   ├── dashboard/         # Dashboard
│   │   │   ├── users/             # Gestión de usuarios
│   │   │   ├── companies/         # Gestión de compañías
│   │   │   └── products/          # Gestión de productos
│   │   └── shared/                # Componentes compartidos
│   │       ├── components/        # Componentes reutilizables
│   ├── assets/                    # Recursos estáticos
│   ├── environments/              # Configuración de entornos
│   └── styles.scss                # Estilos globales
└── README.md                      # Documentación
```

## Usuario por Defecto

Para acceder por primera vez, utiliza el usuario administrador predeterminado:

- **Email**: admin@example.com
- **Password**: admin123

## Despliegue en Producción

### Backend

1. Configura las variables de entorno adecuadas para producción
2. Genera la build de producción: `npm run build`
3. Inicia el servidor: `npm run start:prod`

### Frontend

1. Genera la build de producción: `ng build --configuration production`
2. Despliega los archivos generados en `dist/frontend` en un servidor web (Nginx, Apache, etc.)

## Estructura de la Base de Datos

### Entidades Principales

- **Users**: Usuarios del sistema con roles y permisos
- **Companies**: Información de compañías con detalles financieros
- **Products**: Productos que pueden estar asociados a múltiples compañías
- **Departments**: División política (departamentos de Colombia)
- **Cities**: Ciudades asociadas a departamentos

### Relaciones

- Una compañía puede tener múltiples usuarios
- Una compañía puede tener múltiples productos
- Un producto puede estar asociado a múltiples compañías
- Una ciudad pertenece a un departamento
- Una compañía está ubicada en una ciudad y departamento

## Pruebas

### Backend

```bash
# Ejecutar pruebas unitarias
npm run test

```

## Solución de Problemas Comunes

### Backend

**Error de conexión a la base de datos:**
- Verifica que PostgreSQL esté en funcionamiento
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que la base de datos exista

**Error al iniciar el servidor:**
- Verifica que el puerto 3000 no esté en uso
- Ejecuta `npm run build` para verificar errores de compilación

### Frontend

**Error al iniciar la aplicación:**
- Verifica que Angular CLI esté instalado correctamente
- Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas
- Comprueba que el archivo `environment.ts` tenga la URL correcta del backend

**No se muestran datos en la aplicación:**
- Verifica que el backend esté en funcionamiento
- Revisa la consola del navegador para errores
- Comprueba los logs del servidor para errores de autenticación

---