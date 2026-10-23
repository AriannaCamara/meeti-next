# Meeti Next

**Plataforma fullstack para crear y descubrir comunidades y eventos (meetis) — con un asistente de IA que busca datos reales en tiempo real.**

> [English](./README.md) | **Español**

> 🚀 **Demo en vivo:** [meeti-next.vercel.app](https://meeti-next.vercel.app)

Meeti Next es una aplicación web lista para producción donde los usuarios pueden unirse a comunidades, crear eventos presenciales o virtuales, confirmar asistencia y recibir notificaciones en tiempo real. Su punto destacado es un **asistente de IA con tool calling** que consulta la base de datos directamente para recomendar meetis y comunidades en lenguaje natural.

---

## Funcionalidades

### Autenticación y seguridad
- Registro con **verificación de email obligatoria** (nodemailer + Mailtrap)
- Recuperación de password por email
- Cambio de password con **revocación opcional de sesiones**
- Lista de **sesiones activas por dispositivo** con revocación individual
- **Rate limiting propio en base de datos** (ventana fija por IP) en registro, login, reset de password y asistencia

### Comunidades
- CRUD completo (solo el creador puede editar/eliminar)
- Unirse / salirse — el dueño recibe una **notificación en tiempo real** cuando alguien se une
- **Re-confirmación de password** para eliminar una comunidad
- Página pública con próximos meetis, conteo de miembros e info del organizador

### Meetis (Eventos)
- CRUD completo (solo los admins de la comunidad pueden gestionar)
- **12 categorías sembradas** (Programación, Diseño, Negocios, etc.)
- **Virtuales o presenciales**: los presenciales usan **mapas Leaflet** con marcadores de click/drag y **geocodificación inversa de ArcGIS** (dirección, ciudad y país se completan automáticamente)
- **Confirmar / cancelar asistencia** — el organizador recibe una **notificación en tiempo real**
- Lista de asistentes (solo el organizador)
- **Los meetis pasados devuelven un 404 amigable**; los listados solo muestran eventos futuros
- Subida de imágenes con **UploadThing** (validación de tipo y tamaño)

### Asistente IA (Diferenciador clave)
- Chat con **respuestas en streaming** (Vercel AI SDK + OpenRouter)
- **4 tools que consultan la base de datos real**: comunidades por tema, meetis por tema, meetis virtuales (entiende "hoy"), y meetis presenciales por ciudad/país
- Los resultados se renderizan como **tarjetas navegables**, no como texto plano
- Modelo gratuito con **fallback automático entre 3 modelos**; respuestas forzadas a español; manejo de errores visible al usuario

### Notificaciones en tiempo real
- Con **Pusher**: badge en el sidebar + lista completa, entregadas al instante
- Eventos: unirse a una comunidad, confirmar asistencia a un meeti

### Perfil
- Editar nombre, bio y avatar
- **Perfil público** mostrando comunidades creadas y meetis organizados
- **SEO**: metadata de páginas + Open Graph + Twitter cards

### Dashboard
- Sidebar responsive: comunidades, meetis (con conteo de asistentes), notificaciones, seguridad

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16** (App Router, typed routes) + **React 19** |
| Lenguaje | TypeScript (strict) |
| Base de datos | **PostgreSQL** (Neon) + **Drizzle ORM** (migraciones, relaciones) |
| Auth | **better-auth** (adaptador Drizzle, verificación de email, multi-sesión) |
| IA | **Vercel AI SDK** + **OpenRouter** (tool calling, streaming) |
| Estilos | **Tailwind CSS 4** + dark mode + Headless UI |
| Formularios | react-hook-form + **Zod** (validación client & server) |
| Imágenes | UploadThing |
| Tiempo real | Pusher |
| Mapas | Leaflet + react-leaflet + geocodificación inversa ArcGIS |
| Email | nodemailer (Mailtrap) |
| Deploy | Vercel |

---

## Arquitectura

El código sigue una **estructura por features** con separación clara de responsabilidades:

```
src/
├── features/           # Una carpeta por feature del dominio
│   ├── auth/           #   actions · services · schemas · components
│   ├── communities/
│   ├── meetis/
│   ├── ai/             #   tools · components · types
│   ├── notifications/
│   └── profile/
├── shared/             # Componentes reutilizables, utils, primitivas de formularios
├── lib/                # auth, limiter, nodemailer, pusher, uploadthing
├── emails/             # Plantillas y servicios de email
└── db/                 # Schema Drizzle, relaciones, seed
```

Patrones clave:
- **Server Components por defecto** — las páginas obtienen datos vía services en el servidor
- **Server Actions** para todas las mutaciones, con validación Zod en cliente y servidor
- **Services en capas**: Action → Service → Repository, con **clases Policy** para permisos aplicados en el servidor (no solo en la UI)
- **Discriminated unions** en Zod para meetis virtuales vs presenciales (los presenciales requieren ubicación con coordenadas válidas)
- `cache()` de React para deduplicación de datos a nivel de request

---

## Primeros Pasos

### Requisitos previos
- Node.js 20+
- Una base de datos PostgreSQL (ej. [Neon](https://neon.tech))
- Servicios: [UploadThing](https://uploadthing.com), [Pusher](https://pusher.com), [Mailtrap](https://mailtrap.io) (o cualquier SMTP), [OpenRouter](https://openrouter.ai)

### Variables de entorno

Crea un archivo `.env` con las siguientes variables (solo nombres — nunca subas secretos):

```bash
# App
APP_NAME=Meeti
APP_URL=http://localhost:3000
SITE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...

# Auth (better-auth)
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000

# Email (SMTP)
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_USER=...
EMAIL_PASS=...

# UploadThing
UPLOADTHING_TOKEN=...

# Pusher
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=...

# AI (OpenRouter)
OPEN_ROUTER_KEY=...
```

### Instalación

```bash
# Instalar dependencias
npm install

# Push del schema a la base de datos
npx drizzle-kit push

# Sembrar las 12 categorías
npm run drizzle:seed

# Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint` | Ejecutar ESLint |
| `npm run drizzle:seed` | Sembrar categorías en la BD |
| `npx drizzle-kit push` | Push del schema a la BD |
| `npx drizzle-kit generate` | Generar archivos de migración |

---

## Schema de Base de Datos

| Tabla | Propósito |
|---|---|
| `users`, `sessions`, `accounts`, `verifications` | Auth (better-auth) |
| `communities`, `community_members` | Comunidades y membresía |
| `meetis`, `meeti_locations`, `meeti_attendees` | Eventos, ubicaciones, asistencia |
| `categories` | 12 categorías sembradas |
| `notifications` | Registros de notificaciones en tiempo real |
| `rate_limits` | Rate limiting respaldado por la BD |

---

## Por Qué Este Proyecto?

No es un clon de un tutorial — es una aplicación completa lista para producción que requirió resolver problemas reales:

- **IA con datos reales**: el asistente usa function calling para consultar la base de datos, no es un chatbot genérico. Hace streaming de respuestas y renderiza resultados como tarjetas de UI navegables.
- **Tiempo real en cada punto de contacto**: unirse a una comunidad o confirmar asistencia notifica al dueño al instante vía Pusher.
- **Seguridad por diseño**: las políticas de permisos viven en el servidor, la verificación de email es obligatoria, el rate limiting está respaldado por la base de datos, y las acciones destructivas requieren re-confirmación de password.
- **Arquitectura limpia**: carpetas por feature con capas Service / Repository / Policy hacen el código escalable y fácil de navegar.

---

## Autora

Creado por **Arianna Camara** — Junior Fullstack Developer.

- 💻 [GitHub](https://github.com/AriannaCamara)
- 🔗 LinkedIn: *agrega aquí la URL de tu perfil*

---

## Licencia

Este proyecto es para fines de portafolio y educativos.
