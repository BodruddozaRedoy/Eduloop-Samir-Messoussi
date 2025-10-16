# Extra Handen - AI Practice Platform

An interactive learning platform for the Extra Handen programme, built with React 19, TypeScript, and Vite. The app guides pupils from a secure passcode login through group, subject, and category selection before delivering adaptive practice activities in arithmetic, reading, spelling, vocabulary, and language. Session progress is tracked locally and summarised in real time, while the UI stays responsive, multilingual, and teacher friendly.

## Table of Contents
- [Features](#features)
- [Learning Flow](#learning-flow)
- [Tech Stack](#tech-stack)
- [Development & Deployment Tools](#development--deployment-tools)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing & Quality](#testing--quality)
- [Deployment](#deployment)
- [Troubleshooting & Tips](#troubleshooting--tips)

## Features
- Passcode-protected login that verifies access using the `/token-verify/` endpoint and stores the issued access key securely in `localStorage`.
- Guided selection flow: group (year) -> subject -> category and subcategory, powered by TanStack React Query for real-time data and caching.
- Rich question rendering system with dozens of arithmetic layout types, multiple-choice, fill-in-the-blank, short-answer, and chart-based reading comprehension activities.
- Centralised question controls (check, hint, show solution) exposed via context so every question type reuses the same controller UI.
- Result tracking via `useResultTracker`, persisting right/wrong answers in `localStorage` and presenting a detailed summary screen.
- Built-in Google Translate widget and dropdown to make the interface accessible in multiple languages without leaving the app.
- Responsive design built with Tailwind CSS 4 utility classes and Shadcn UI primitives, ensuring consistent theming across views.
- Toast notifications powered by `sonner` for user feedback during authentication and question fetching.

## Learning Flow
1. **Welcome and Login** - Visitors reach the welcome hero (`/`), then authenticate with a passcode on `/login`. A valid access key is persisted for future sessions.
2. **Group Selection** - Learners choose their cohort/year on `/group`, which stores the `groupId` needed for later API requests.
3. **Subject and Category** - `/subject` and `/category` fetch available lessons. Category and subcategory ids are stored in `localStorage`, and starting a quiz opens a difficulty dialog before calling `/questions/`.
4. **Practice Sessions** - Arithmetic, reading, spelling, language, and vocabulary pages render dynamic question metadata. Each question registers callbacks with the `QuestionControlsContext` so the shared controller bar can trigger checks, hints, and solutions.
5. **Progress and Results** - Every check updates the result tracker. Learners can jump to `/result` for a breakdown of right and wrong answers, reset progress, or return to choose new material.

## Tech Stack
### Core UI and Styling
- **React 19** with function components and hooks.
- **TypeScript** for strong typing across components, hooks, and contexts.
- **React Router 7** for nested layouts (`MainPageLayout`) plus route-level code organisation.
- **Tailwind CSS 4** utilities configured through `@tailwindcss/vite`; no standalone config file required.
- **Shadcn/UI primitives** (`button`, `dialog`, `dropdown-menu`, `checkbox`) managed via `components.json` to maintain design consistency.
- **Lucide React** and **react-icons** for iconography.

### State and Data
- **TanStack React Query** handles remote data (groups, subjects, categories, questions) with fine-grained caching, manual refetching, and dependency-aware enabling.
- **Axios** (`AxiosPublic`) centralises REST calls, attaches the stored `access-key` as an `Authorization` header, and enables cookie-based APIs via `withCredentials`.
- **LocalStorage** persists session ids, selections, and quiz results, ensuring refresh-resilient experiences.
- **Context Providers** (`QuestionControlsContext`, `QuestionMetaContext`) coordinate question-level metadata and controller actions.

### Tooling and Build
- **Vite 7** dev server and bundler with React plugin and Tailwind integration (`vite.config.ts`).
- **TypeScript project refs** (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`) to optimise build pipelines.
- **ESLint 9** with TypeScript, React Hooks, React Refresh, and TanStack Query plugins, configured in `eslint.config.js`.
- **Jest 30** with **ts-jest** and **Testing Library** for component and flow testing (`jest.config.cjs`, `jest.setup.ts`).
- **Mkcert certificates** (`localhost.pem`, `localhost-key.pem`) are checked in for optional HTTPS development.

## Development & Deployment Tools
### Development
- Node.js 20 (also used in the Docker build stage).
- npm (primary package manager, with `package-lock.json` committed).
- Bun lockfile (`bun.lock`) present for alternative workflows if desired.
- Vite dev server on port 6868 with host binding and wildcard `allowedHosts` for LAN testing.

### Deployment and Operations
- **Docker multi-stage image**: Node 20 Alpine builds the static bundle, then Nginx serves `dist/` (see `Dockerfile`).
- **Docker Compose** (referenced in the deployment workflow) orchestrates containers on the VPS.
- **GitHub Actions** workflow (`.github/workflows/deploy.yml`) deploys to a remote VPS on every `main` branch push: it prepares an SSH tunnel, pulls the latest code, rebuilds Docker images, prunes old containers, and recreates the stack.
- **Vercel configuration** (`vercel.json`, `.vercel/project.json`) for static hosting alternatives, mapping SPA routes back to `index.html`.

## Project Structure
```
public/                  # Static assets (logo, background images, data samples)
src/
  components/
    common/              # Shared UI widgets (controllers, hints, loading states)
    layout/              # Navbar, footer, Google Translate integrations
    ui/                  # Shadcn-styled primitives
  context/               # Question control and metadata providers
  hooks/                 # Data fetching (group, subject, category), state helpers
  layouts/               # Root layout wrapping routed pages
  pages/
    Arithmetic/          # Question renderer and type-specific components
    Category/            # Category selection with difficulty dialog
    Group/, Login/, Subject/ etc.
    Reading/, Spelling/, Vocabulary/, Language/
    Welcome/, Result/
  routes/                # Route definitions using createBrowserRouter
  config/axios.ts        # Axios instance with auth interceptor
  index.css / main.tsx
Dockerfile
eslint.config.js
jest.config.cjs
vercel.json
vite.config.ts
```

## API Integration
- All HTTP requests go through `AxiosPublic`, pointing to `http://10.10.13.60:8090/api` by default. Update this to match your backend environment.
- `Authorization` headers are automatically populated from `localStorage.getItem("access-key")`.
- Question fetch calls send `group_id`, `subject_id`, and the selected `category_ids` / `subcategory_ids` plus `X-Session-Id` headers for session continuity.
- React Query disables caching (`gcTime: 0`, `staleTime: 0`) so every navigation fetches fresh data, while `enabled` flags prevent unnecessary API hits.

## Getting Started
### Prerequisites
- Node.js 20+
- npm 9+ (or Bun if you prefer)
- Optional: `mkcert` if you want to regenerate HTTPS certificates.

### Installation
```bash
npm install
```

### Configure API base URL
Set your backend host in `src/config/axios.ts`. For environment-specific setups, you can expose the value through Vite environment variables and read it with `import.meta.env`.

### Run the development server
```bash
npm run dev
```
The app runs on [http://localhost:6868](http://localhost:6868). Use the `--host` flag (already enabled in `vite.config.ts`) to access it from other devices on your network.

### Optional HTTPS
Certificates generated with `mkcert` (`localhost.pem`, `localhost-key.pem`) live in the project root. Wire them into Vite if you want to serve HTTPS locally:
```ts
// vite.config.ts (example snippet)
server: {
  https: {
    key: fs.readFileSync("localhost-key.pem"),
    cert: fs.readFileSync("localhost.pem")
  }
}
```

## Available Scripts
- `npm run dev` - start Vite in development mode with HMR.
- `npm run build` - create an optimised production bundle in `dist/`.
- `npm run preview` - serve the built bundle locally via Vite preview.
- `npm run lint` - run ESLint across the codebase.
- `npm run test` - execute Jest unit/integration tests in watch mode.

## Testing & Quality
- **Jest + Testing Library** cover UI interactions such as category selection (`src/__test__/CategoryPage.test.tsx`) and arithmetic question types (`src/__test__/ArrType_1.test.tsx`).
- **Jest environment** is set to `jsdom` with additional polyfills (`TextEncoder`, `TextDecoder`) in `jest.setup.ts`.
- **ESLint** runs React hooks rules, TypeScript static analysis, and TanStack Query checks to highlight potential caching or data-fetching issues.
- Consider adding automated formatting (Prettier or Biome) if you need consistent code styling across contributors.

## Deployment
### Docker
- Build the production image:
  ```bash
  docker build -t extra-handen-client .
  ```
- Run the container:
  ```bash
  docker run -p 8080:80 extra-handen-client
  ```
  This serves the compiled SPA through Nginx.

### GitHub Actions -> VPS
The workflow at `.github/workflows/deploy.yml`:
1. Triggers on pushes to `main`.
2. Creates an SSH session using repository secrets (`VPS_KEY`, `VPS_HOST`, `VPS_USER`, `VPS_PATH`).
3. Pulls the latest code on the remote server, shuts down existing Docker Compose services, prunes unused images, rebuilds with `--no-cache`, and restarts the stack in detached mode.

### Vercel
If you prefer serverless hosting:
1. Connect the repository to Vercel.
2. Vercel reads `vercel.json`, runs `npm run build`, and outputs to `dist/`.
3. SPA routing is handled by forwarding all unmatched routes to `index.html`.

## Troubleshooting & Tips
- If you see `Failed to load question`, confirm the backend is reachable and that `Authorization` headers include the passcode prefixed with `AccessKey `.
- When modifying question components, always register controller handlers (`setControls`) so shared buttons (check, hint, solution) continue to work.
- The result tracker emits a custom event (`quizResults:updated`). Subscribe via `onResultsUpdated` if you need live updates elsewhere.
- To avoid stale group/subject/category data, React Query is configured to refetch on every mount. Adjust `staleTime` if you introduce client-side caching.
- Remember to keep `localStorage` keys in sync (`groupId`, `subjectId`, `sessionId`, `categories`, `subcategories`, `quizResults`) when integrating new flows.

---

Happy teaching and learning! Let the Extra Handen platform give every pupil the targeted practice they need.
