# Repository Guidelines

## Project Structure & Module Organization

Schachmeister is an educational Vite + React + TypeScript project. Source lives in `src/`, with `main.tsx` bootstrapping the UI from `src/ui/App.tsx`. All agent-owned components and styles live in `src/ui`, while the kids own `src/schach` for models and rules (treat it as read-only). Assets live in `src/assets`, builds emit to `dist/`, and static files stay in `public/`. Styling uses Tailwind.

## Educational Mission & Collaboration Boundaries

Protect the teaching goal behind this repo. Never modify `src/schach` unless the family supplies a patch—that folder owns rules and terminology. When UI work needs new hooks into game logic, request the interfaces you need and document expectations so the kids can implement them.

## Build, Test, and Development Commands

- `npm install` — install dependencies; run after cloning or when `package.json` changes.
- `npm run dev` — launch Vite dev server with hot reload on http://localhost:5173.
- `npm run build` — type-checks via `tsc -b` then emits optimized assets to `dist/`.
- `npm run preview` — serve the last production build for smoke-testing.

## Coding Style & Naming Conventions

Use TypeScript everywhere; prefer explicit exported types as in `src/schach/types.ts`. Components stay functional, typed through props, and placed in `src/ui`. Indent with two spaces and keep double-quoted strings to match Prettier defaults. Tailwind utility classes should express styling inline, with shared patterns extracted through presentational wrappers when repetition shows up—avoid resurrecting standalone CSS unless Tailwind cannot cover the use case. Game-domain names are German (`brett`, `figur`); respect that vocabulary and let the kids drive any renames in their domain files.

## Testing Guidelines

No automated test runner ships yet, so lean on `npm run build` and manual board interaction in dev preview. For logic-heavy additions, jot TypeScript helpers that describe expected moves and propose `vitest` when the curriculum allows. Whatever approach you use, document new test commands and ensure build passes.

## Commit & Pull Request Guidelines

Existing history favors concise, imperative commits (`scaffold chess board`, `refactor: convert to Vite React TS`). Follow that tone. Each PR should: explain the change and motivation, link to issues or tasks, list verification steps (include `npm run build`), and attach UI screenshots or GIFs whenever the board appearance shifts. Explicitly confirm that no files in `src/schach` were changed (or call out why, if the family provided updates).
