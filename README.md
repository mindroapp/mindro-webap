# Mindro WebApp

Frontend for the Mindro platform — a clinical practice management system for mental health professionals. Built with React 18, TypeScript, Vite, and Tailwind CSS.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Authentication Flow](#authentication-flow)
- [State Management](#state-management)
- [Routing](#routing)
- [API Communication](#api-communication)
- [UI & Design System](#ui--design-system)
- [Features](#features)
- [Development Setup](#development-setup)
- [Environment Variables](#environment-variables)
- [Scripts Reference](#scripts-reference)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 + TypeScript 5.5 |
| Build tool | Vite 5.4 (dev server on port 3002) |
| Routing | React Router DOM 6 |
| State management | Zustand 5 (sliced store) + Context API |
| Data fetching | TanStack Query v5 (React Query) |
| Forms | React Hook Form 7 + Zod validation |
| UI components | Radix UI (28+ primitives) + shadcn/ui |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React |
| Teleconsultation | Twilio Video 2.31 |
| Charts | Recharts |
| PDF export | jsPDF + html2canvas |
| Date utilities | date-fns |
| PWA | Vite PWA (Workbox) |
| Dark mode | next-themes |

---

## Architecture

The app is organized in horizontal layers under `src/`. Each layer has a single responsibility:

```
src/
├── main.tsx              # React entry point, QueryClient setup
├── App.tsx               # Router tree (all routes defined here)
├── components/           # Reusable and feature-specific UI components
│   ├── layouts/          # AdminLayout, DashboardLayout, MarketingLayout
│   ├── ui/               # shadcn/ui primitives (auto-generated, do not edit manually)
│   ├── financial/        # PaymentForm, PaymentList, FinancialSummary, ReportsDashboard
│   ├── schedule/         # ScheduleCalendarView, ScheduleAppointmentsView, ScheduleForm
│   └── ...               # Patient*, Session*, Document*, Teleconsultation/, Admin* components
├── pages/                # One file per route (~32 pages)
├── context/
│   ├── AuthContext.tsx   # Authentication state, login/register/logout
│   └── ThemeContext.tsx  # Dark/light mode
├── stores/               # Zustand sliced store
│   ├── patientStore.ts   # Combines all slices
│   └── slices/           # patientSlice, sessionSlice, documentSlice,
│                         #   scheduleSlice, availabilitySlice, financialSlice
├── services/             # All HTTP calls (one file per domain)
│   ├── apiClient.ts      # Base fetch wrapper (credentials, auto-refresh, 401 handling)
│   ├── authService.ts    # login, register, logout
│   ├── patientsService.ts
│   ├── scheduleService.ts
│   ├── financialService.ts
│   ├── dashboardService.ts
│   ├── usersService.ts
│   └── schedulePublicProfileService.ts
├── hooks/
│   ├── use-toast.ts      # Toast notification hook
│   └── use-mobile.tsx    # Responsive breakpoint detection
└── lib/
    └── utils.ts          # Tailwind merge helpers (cn())
```

### Design Decisions

- **No barrel index files** — imports reference the exact file to keep tree-shaking effective
- **Pages are thin** — pages orchestrate components and call services; business logic lives in services and stores
- **Zustand over Context for mutable state** — Context is used only for auth (rarely changes); all domain state (patients, sessions, financial) lives in Zustand slices
- **React Query for server state** — async data that needs background refresh (dashboard, schedule) goes through React Query; Zustand holds local/optimistic state
- **Zod schemas colocated with forms** — validation schema is defined in the same file as the form component

---

## Authentication Flow

Authentication uses **httpOnly cookies** — the browser sends credentials automatically and JavaScript never has access to raw tokens.

### Login

```
1. User submits credentials → POST /auth/login
2. API sets httpOnly cookies: access_token (short-lived), refresh_token (long-lived)
3. AuthContext stores the user object in React state (not localStorage)
4. On every page refresh, AuthContext calls GET /users/profile/me to restore the session
   from the active cookie — no localStorage read needed
```

### Token Auto-Refresh

`apiClient.ts` handles this transparently:

```
1. Any 401 response from the API (excluding /auth/* routes)
2. → apiFetchJson fires POST /auth/refresh (credentials: include)
3. → If refresh succeeds: new access_token cookie set; original request retried
4. → If refresh fails: window event auth:session-expired is dispatched
5. → AuthContext listener clears user state → user is redirected to /login
```

### Logout

```
POST /auth/logout → API clears cookies (Max-Age=0) → AuthContext clears user state
```

### Role-Based Access

| Role | Access |
|---|---|
| `professional` | `/dashboard`, `/patients`, `/schedule`, `/financial`, `/settings` |
| `admin` | All professional routes + `/admin/*` |

`ProtectedRoute` wraps private routes and redirects unauthenticated users to `/login`. `PublicRoute` wraps login/register and redirects already-authenticated users to `/dashboard`.

---

## State Management

Zustand is used for all domain state that needs to be shared across components. The store is built from **slices** combined in `patientStore.ts`:

| Slice | Responsibility |
|---|---|
| `patientSlice` | Patient CRUD (add, update, delete, select) |
| `sessionSlice` | Therapy session records per patient |
| `documentSlice` | Uploaded document references |
| `scheduleSlice` | Schedule event management |
| `availabilitySlice` | Time slot availability rules |
| `financialSlice` | Payments and session packages |

The store is persisted to `localStorage` under the key `patient-storage` via Zustand's `persist` middleware — this allows offline browsing of previously loaded data and survives page refreshes.

**Rule of thumb:**
- Use Zustand when state is shared between multiple components or pages
- Use `useState` for local UI state (modal open/close, form drafts)
- Use React Query when data comes from the API and needs background refresh

---

## Routing

All routes are defined in `src/App.tsx`.

### Public Routes

| Path | Page |
|---|---|
| `/` | LandingPage |
| `/plans` | PlansPage |
| `/platform/resources` | ResourcesPage |
| `/platform/security` | SecurityPage |
| `/company/blog` | BlogPage |
| `/company/contact` | ContactPage |
| `/legal/terms`, `/legal/privacy`, `/legal/cookies` | Legal pages |
| `/agendamento/:professionalId` | PublicBooking (unauthenticated appointment booking) |
| `/meeting`, `/video-meeting` | Video call (token-based access) |

### Auth Routes (redirect to dashboard if already logged in)

| Path | Page |
|---|---|
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/forgot-password` | ForgotPasswordPage |

### Protected Routes (require authentication)

| Path | Page |
|---|---|
| `/dashboard` | Dashboard (professionals) or AdminDashboard (admins) |
| `/patients` | PatientList |
| `/patients/new` | PatientForm |
| `/patients/:id` | PatientDetail |
| `/patients/:id/sessions/new` | SessionForm |
| `/patients/:id/documents/upload` | DocumentUpload |
| `/schedule` | SchedulePage |
| `/schedule/:eventId` | ScheduleEventDetail |
| `/financial` | FinancialPage |
| `/settings` | SettingsPage |
| `/professional-settings` | ProfessionalSettings |
| `/support` | SupportTickets |

### Admin-Only Routes

| Path | Page |
|---|---|
| `/admin/dashboard` | AdminDashboard |
| `/admin/professionals` | ProfessionalsManagement |
| `/admin/clients` | ClientsManagement |
| `/admin/whatsapp` | WhatsAppConfig |

---

## API Communication

All HTTP calls go through two layers:

### `apiClient.ts` — base layer

- `apiFetch(endpoint, options)` — raw fetch with `credentials: 'include'` (cookie forwarding)
- `apiFetchJson<T>(endpoint, options)` — fetch + JSON parse + 401 auto-refresh logic

```ts
// Usage in a service file
import { apiFetchJson } from '@/services/apiClient';

export async function getPatients(): Promise<Patient[]> {
  return apiFetchJson('/patients', { method: 'GET' });
}
```

### Service files — domain layer

Each domain has its own service file that calls `apiFetchJson` and returns typed data. Pages and components import from services — never call `apiFetch` directly from a component.

### Error Handling

- `apiFetchJson` throws an `Error` with the API's `message` field on non-2xx responses
- Components catch errors from service calls and display toast notifications
- 401 errors that survive the auto-refresh attempt surface the `auth:session-expired` event, which `AuthContext` handles globally

---

## UI & Design System

The design system is built on **Radix UI primitives** wrapped with **Tailwind CSS** via the [shadcn/ui](https://ui.shadcn.com/) pattern. Components live in `src/components/ui/` and are not edited directly — add new variants via Tailwind class composition.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `primary` | `#4F46E5` (indigo) | CTAs, active states |
| `secondary` | `#818CF8` | Secondary actions |
| `accent` | `#C7D2FE` | Highlights, badges |
| `muted` | `#EEF2FF` | Backgrounds, empty states |

### Patterns

- **Modal forms** — CRUD operations (add patient, record payment, create session) open in a `Dialog` from Radix UI; the form renders inside; on submit it calls the relevant service and closes the modal
- **`cn()` utility** — all conditional class merging uses `cn()` from `src/lib/utils.ts` (wraps `clsx` + `tailwind-merge`)
- **Dark mode** — `next-themes` provider wraps the app; use `dark:` Tailwind variants

---

## Features

| Feature | Description |
|---|---|
| Multi-role dashboard | Professionals see their practice overview; admins see platform-wide metrics |
| Patient management | Full CRUD — demographics, contact info, session history, documents |
| Electronic health records | Session notes, clinical assessments, diagnosis tracking per patient |
| Scheduling | Calendar view, recurring availability rules, appointment status workflow |
| Public booking | Shareable link for patients to book directly with a professional |
| Teleconsultation | Live video sessions via Twilio Video embedded in the app |
| Financial tracking | Payment records, session packages, monthly revenue charts (Recharts) |
| PDF export | Generate patient detail reports via jsPDF + html2canvas |
| Document management | Upload, preview, and download clinical documents |
| Professional profile | Customizable public-facing profile (bio, photo, services, pricing) |
| Admin controls | Approve/suspend professionals, view platform stats, manage configuration |
| PWA | Installable, offline-capable via Workbox service worker |
| Dark mode | System preference detection + manual toggle |

---

## Development Setup

### Prerequisites

- Node.js 20+
- Mindro API running on `http://localhost:4002` (see [mindro-api README](../mindro-api/README.md))

### Installation

```bash
npm install
```

### Running in Development

```bash
npm run dev
```

The app will be available at [http://localhost:3002](http://localhost:3002).

The sitemap is auto-generated before the server starts (`predev` script).

### Building for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:4002/api
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:4002/api` | Base URL for all API requests |

In production, set `VITE_API_URL` to the deployed API URL before running `npm run build`.

---

## Scripts Reference

```bash
npm run dev          # Start Vite dev server (port 3002) — generates sitemap first
npm run build        # Production build — generates sitemap first
npm run build:dev    # Dev build with source maps
npm run preview      # Serve the production build locally
npm run lint         # ESLint check
```
