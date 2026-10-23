# Meeti Next

**Fullstack platform to create and discover communities and events (meetis) — with an AI assistant that searches real data in real time.**

> **English** | [Español](./README.es.md)

> 🚀 **Live demo:** [meeti-next.vercel.app](https://meeti-next.vercel.app)

Meeti Next is a production-ready web application where users can join communities, create in-person or virtual events, confirm attendance, and receive real-time notifications. The highlight is an **AI assistant with tool calling** that queries the database directly to recommend meetis and communities in natural language.

---

## Features

### Authentication & Security
- Sign-up with **mandatory email verification** (nodemailer + Mailtrap)
- Password recovery via email
- Password change with optional **session revocation**
- Active **multi-device sessions** list with individual revocation
- Custom **database-backed rate limiting** (fixed window per IP) on sign-up, login, password reset, and attendance

### Communities
- Full CRUD (only the owner can edit/delete)
- Join / leave communities — the owner receives a **real-time notification** when someone joins
- **Password re-confirmation** required to delete a community
- Public page with upcoming meetis, member count, and organizer info

### Meetis (Events)
- Full CRUD (only community admins can manage)
- **12 seeded categories** (Programming, Design, Business, etc.)
- **Virtual or in-person**: in-person meetis use **Leaflet maps** with click/drag markers and **ArcGIS reverse geocoding** (address, city, and country filled automatically)
- **Confirm / cancel attendance** — the organizer receives a **real-time notification**
- Attendees list (organizer only)
- **Past meetis return a friendly 404**; listings only show upcoming events
- Image uploads via **UploadThing** (type and size validation)

### AI Assistant (Key Differentiator)
- Chat with **streaming responses** (Vercel AI SDK + OpenRouter)
- **4 tools that query the real database**: communities by topic, meetis by topic, virtual meetis (understands "today"), and in-person meetis by city/country
- Results rendered as **navigable cards**, not plain text
- Free-tier model with **automatic fallback across 3 models**; Spanish-only responses; user-visible error handling

### Real-Time Notifications
- Powered by **Pusher**: sidebar badge + full list, delivered instantly
- Events: community join, meeti attendance confirmation

### Profile
- Edit name, bio, and avatar
- **Public profile** showing created communities and organized meetis
- **SEO**: page metadata + Open Graph + Twitter cards

### Dashboard
- Responsive sidebar: communities, meetis (with attendee counts), notifications, security

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, typed routes) + **React 19** |
| Language | TypeScript (strict) |
| Database | **PostgreSQL** (Neon) + **Drizzle ORM** (migrations, relations) |
| Auth | **better-auth** (Drizzle adapter, email verification, multi-session) |
| AI | **Vercel AI SDK** + **OpenRouter** (tool calling, streaming) |
| Styling | **Tailwind CSS 4** + dark mode + Headless UI |
| Forms | react-hook-form + **Zod** (client & server validation) |
| Images | UploadThing |
| Real-time | Pusher |
| Maps | Leaflet + react-leaflet + ArcGIS reverse geocode |
| Email | nodemailer (Mailtrap) |
| Deploy | Vercel |

---

## Architecture

The codebase follows a **feature-based structure** with clear separation of concerns:

```
src/
├── features/           # One folder per domain feature
│   ├── auth/           #   actions · services · schemas · components
│   ├── communities/
│   ├── meetis/
│   ├── ai/             #   tools · components · types
│   ├── notifications/
│   └── profile/
├── shared/             # Reusable components, utils, form primitives
├── lib/                # auth, limiter, nodemailer, pusher, uploadthing
├── emails/             # Email templates and services
└── db/                 # Drizzle schema, relations, seed
```

Key patterns:
- **Server Components by default** — pages fetch data via services on the server
- **Server Actions** for all mutations, with Zod validation on both client and server
- **Layered services**: Action → Service → Repository, with **Policy classes** for permissions enforced on the server (not just the UI)
- **Discriminated unions** in Zod for virtual vs in-person meetis (location with valid coordinates required for the latter)
- React `cache()` for request-level data deduplication

---

## Getting Started

### Prerequisites
- Node.js 20+
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- Accounts/services: [UploadThing](https://uploadthing.com), [Pusher](https://pusher.com), [Mailtrap](https://mailtrap.io) (or any SMTP), [OpenRouter](https://openrouter.ai)

### Environment Variables

Create a `.env` file with the following variables (names only — never commit secrets):

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

### Installation

```bash
# Install dependencies
npm install

# Push the database schema
npx drizzle-kit push

# Seed the 12 categories
npm run drizzle:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run drizzle:seed` | Seed categories into the database |
| `npx drizzle-kit push` | Push schema changes to the database |
| `npx drizzle-kit generate` | Generate migration files |

---

## Database Schema

| Table | Purpose |
|---|---|
| `users`, `sessions`, `accounts`, `verifications` | Auth (better-auth) |
| `communities`, `community_members` | Communities and membership |
| `meetis`, `meeti_locations`, `meeti_attendees` | Events, locations, attendance |
| `categories` | 12 seeded categories |
| `notifications` | Real-time notification records |
| `rate_limits` | Database-backed rate limiting |

---

## Why This Project?

This is not a tutorial clone — it is a full production application that required solving real problems:

- **AI with real data**: the assistant uses function calling to query the database, not a generic chatbot. It streams responses and renders results as navigable UI cards.
- **Real-time at every touchpoint**: joining a community or confirming attendance instantly notifies the owner via Pusher.
- **Security by design**: permission policies live on the server, email verification is mandatory, rate limiting is backed by the database, and destructive actions require password re-confirmation.
- **Clean architecture**: feature-based folders with Service / Repository / Policy layers make the codebase scalable and easy to navigate.

---

## Author

Built by **Arianna Camara** — Junior Fullstack Developer.

- 💻 [GitHub](https://github.com/AriannaCamara)
- 🔗 [LinkedIn](https://www.linkedin.com/in/arianna-camara-65238a2a5)

---

## License

This project is for portfolio and educational purposes.
