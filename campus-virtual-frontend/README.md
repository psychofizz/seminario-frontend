# Campus Virtual Frontend

Frontend para el Campus Virtual educativo basado en el backend desarrollado con FastAPI, GraphQL y PostgreSQL.

## Características

- **Interfaz de usuario moderna** con Next.js 15 y Tailwind CSS
- **Autenticación simple** integrada con el backend
- **Gestión de cursos** para visualizar y administrar cursos
- **Gestión de tareas** para cada curso
- **Gestión de foros** para la comunicación en cursos
- **Gestión de recursos** para compartir archivos en cursos

## Requisitos

- Node.js 18.17 o superior
- Backend de Campus Virtual en ejecución (FastAPI + PostgreSQL)

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd campus-virtual-frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env.local` con la URL del backend:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en <http://localhost:3000>

## Estructura del Proyecto

```
campus-virtual-frontend/
│
├── app/                            # Directorio principal para rutas
│   ├── (dashboard)/                # Layout con autenticación
│   │   ├── courses/                # Páginas de cursos
│   │   │   ├── [id]/               # Detalles de curso
│   │   │   │   ├── assignments/    # Tareas
│   │   │   │   ├── forums/         # Foros
│   │   │   │   └── resources/      # Recursos
│   │   ├── page.tsx                # Homepage
│   ├── auth/                       # Páginas de autenticación
│   ├── globals.css                 # Estilos globales
│   └── layout.tsx                  # Layout principal
│
├── components/                     # Componentes reutilizables
│   ├── Header.tsx                  # Cabecera de la aplicación
│   └── Sidebar.tsx                 # Barra lateral de navegación
│
├── lib/                            # Utilidades
│   ├── api.ts                      # Cliente para API
│   └── auth.ts                     # Funciones de autenticación
│
├── types/                          # Tipos TypeScript
│
├── public/                         # Archivos estáticos
│
├── next.config.js                  # Configuración de Next.js
├── tailwind.config.ts              # Configuración de Tailwind CSS
└── package.json                    # Dependencias
```

## Integración con el Backend

El frontend se conecta al backend a través de una capa de servicios ubicada en `lib/api.ts`. Esta capa proporciona funciones para interactuar con los endpoints REST y GraphQL disponibles en el backend.

Por ejemplo, para obtener la lista de cursos:

```typescript
import { courseAPI } from '@/lib/api';

const courses = await courseAPI.getAll();
```

## Autenticación

La autenticación se maneja en `lib/auth.ts`, que proporciona funciones para:

- Iniciar sesión
- Verificar si el usuario está autenticado
- Obtener datos del usuario actual
- Comprobar roles de usuario

El estado de autenticación se almacena en localStorage para mantener la sesión entre recargas de página.

## Licencia

[MIT](LICENSE)
