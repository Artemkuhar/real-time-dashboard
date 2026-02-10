**Live Demo**: https://artemkuhar.github.io/real-time-dashboard/
**Repository**: https://github.com/Artemkuhar/real-time-dashboard

## Real-Time Data Dashboard

**Project Overview**

- **Purpose**: Real-time event monitoring dashboard (stream, filters, details).
- **Stack**: React 18, TypeScript, Vite, Tailwind CSS, Headless UI, Zustand, React Window, Vitest, Cypress.

**Technical Decisions**

- **FSD-style structure** for clear separation and scaling:
  - `app` — app shell and providers.
  - `pages` — route-level pages (Dashboard).
  - `widgets` — large blocks (EventFeed, EventDetails).
  - `features` — user flows (Filters, Search, Settings).
  - `entities` — domain logic (event types, constants, API/model).
  - `shared` — common UI, libs, test helpers.
- **State**: Zustand store for filters, selection, and settings.
- **Performance**: Virtualized list (`react-window` / `@tanstack/react-virtual`) for large event streams.
- **Styling**: Tailwind CSS with small primitives and Headless UI/Radix for accessible components.

**Features**

- Continuous event simulation (every 1–3 seconds).
- Virtualized feed showing the latest N events.
- Filters by type and source, plus text search.
- Details panel with JSON view and copy-to-clipboard.
- Settings ready for persistence (e.g., via local storage).

**Code Quality**

- **Linting**: ESLint with React + TypeScript rules (`npm run lint`).
- **Formatting**: Prettier for consistent style (`npm run format`).
- **Type Safety**: Strict TypeScript configuration.

**Testing**

- **Unit / Integration**: Vitest + React Testing Library:
  - `npm test` — run tests once.
  - `npm run test:dev` — watch mode.
  - `npm run test:coverage` — coverage report.
- **E2E**: Cypress tests in `cypress/e2e/`:
  - Dashboard loading and layout.
  - Event feed rendering and scrolling.
  - Filters and search combinations.
  - Event details panel and JSON copy.
  - Real-time updates handling.

**CI/CD**

- **CI Commands:**
  - Lint (no warnings): `npm run lint:ci`.
  - Format check: `npm run format:check`.
  - Unit tests: `npm test`.
  - E2E with auto dev server: `npm run test:e2e:ci` (via `start-server-and-test` → `npm run dev -- --port 4173` → `cypress run`).
- **Workflows:**
  - `lint.yml` — runs on PR/push to main: Prettier check + ESLint with zero warnings.
  - `tests.yml` — runs on all branches/PRs: Unit tests + E2E tests with artifact upload on failure.
  - `deploy.yml` — runs on push to main: Full test suite + build + deploy to GitHub Pages.
- **Practices:** Fast-fail on lint, single-source build/test scripts, GitHub Actions ready.

**Setup & Run**

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Format (write)
npm run format

# Unit / integration tests
npm test
npm run test:dev
npm run test:coverage

# Cypress (requires dev or preview running)
npm run cy:open
npm run cy:run
```
