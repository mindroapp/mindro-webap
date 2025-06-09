# mindro-webapp

A modern, full-featured web application for mental health professionals to manage their clinical practice, including scheduling, electronic health records, teleconsultation, financial management, and more.

---

## Table of Contents
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Developing New Features](#developing-new-features)
- [Fixing Bugs](#fixing-bugs)
- [Contributing](#contributing)

---

## Architecture

Mindro WebApp is a modular, scalable, and maintainable React application built with TypeScript and Vite. It uses a feature-based folder structure, state management with Zustand, and modern UI libraries. The app supports both professional and administrative roles, with protected routes and role-based access.

- **Frontend:** React 18, TypeScript, Vite
- **State Management:** Zustand
- **Routing:** React Router DOM
- **UI:** Tailwind CSS, Radix UI, Lucide Icons
- **Data Fetching:** React Query, Axios
- **Authentication:** Context API
- **Other:** date-fns, zod, embla-carousel, recharts, twilio-video

## Folder Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI and feature components
│   ├── context/            # React context providers (Auth, Theme, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components (routed)
│   ├── services/           # API and business logic
│   ├── stores/             # Zustand state slices
│   ├── types/              # TypeScript types and interfaces
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles (Tailwind)
├── package.json            # Project metadata and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Technologies
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Radix UI**
- **Zustand**
- **React Query**
- **Axios**
- **React Router DOM**
- **Lucide React**
- **date-fns**
- **zod**
- **twilio-video**
- **Recharts**

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
# or
yarn install
```

### Running the App (Development)
```bash
npm run dev
# or
yarn dev
```
The app will be available at [http://localhost:8080](http://localhost:8080).

### Building for Production
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Developing New Features
1. **Create a new component or page** in the appropriate folder under `src/components` or `src/pages`.
2. **Add state logic** using Zustand slices in `src/stores` if needed.
3. **Add routes** in `src/App.tsx` if your feature is a new page.
4. **Use existing UI components** or create new ones following the project’s design system (Tailwind + Radix UI).
5. **Write types** in `src/types` for new data structures.
6. **Test your feature** locally and ensure it does not break existing functionality.

## Fixing Bugs
1. **Reproduce the bug** and locate the relevant code (use the folder structure and component names for guidance).
2. **Write tests or manual steps** to confirm the bug is fixed.
3. **Follow the code style** (TypeScript, functional components, hooks, Zustand for state).
4. **Run linting** and ensure no errors remain.
5. **Commit with a clear message** describing the fix.

## Contributing
- Fork the repository and create a feature branch.
- Follow the existing code style and structure.
- Open a pull request with a clear description of your changes.

---

For more details, see the code comments and explore the `src/` directory for examples of best practices.