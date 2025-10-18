# Repository Guidelines

## Project Structure & Module Organization

Schachmeister is an educational Vite + React app. `main.tsx` mounts `src/ui/App.tsx`. Agents own everything in `src/ui`; the kids guard `src/schach` (treat it as read-only). Share test setup from `src/test` and keep UI specs in `src/ui/__tests__`. Assets go under `src/assets`, builds land in `dist/`, and static files stay in `public/`. Styling uses Tailwind.

## Educational Mission & Collaboration Boundaries

Protect the teaching goal behind this repo. Never modify `src/schach` unless the family supplies a patch—that folder owns rules and terminology. When UI work needs new hooks into game logic, request the interfaces you need and document expectations so the kids can implement them.

## Build, Test, and Development Commands

- `npm install` — install dependencies; run after cloning or when `package.json` changes.
- `npm run dev` — launch Vite dev server with hot reload on http://localhost:5173.
- `npm run build` — type-checks via `tsc -b` then emits optimized assets to `dist/`.
- `npm run preview` — serve the last production build for smoke-testing.

## Coding Style & Naming Conventions

Use TypeScript everywhere with explicit exports as in `src/schach/types.ts`. Keep components functional, prop-typed, and housed in `src/ui`. Indent with two spaces, prefer double quotes. Style with Tailwind utilities; extract wrappers only when repetition appears—avoid new CSS files unless Tailwind truly falls short. Preserve the German domain names (`brett`, `figur`) and let the kids propose renames.

## Testing Guidelines

Vitest (with jsdom) plus React Testing Library power the UI checks. Use `npm run test` for single runs or `npm run test:watch` while iterating, and keep specs near the UI they cover under `src/ui/__tests__`. Extend assertions via `src/test/setup.ts`, and focus on accessibility labels or rendered state rather than chess rules (those stay in the kids' domain). Always make sure `npm run build` still succeeds before handing off work.

## Commit & Pull Request Guidelines

Existing history favors concise, imperative commits (`scaffold chess board`, `refactor: convert to Vite React TS`). Follow that tone. Each PR should: explain the change and motivation, link to issues or tasks, list verification steps (include `npm run build`), and attach UI screenshots or GIFs whenever the board appearance shifts. Explicitly confirm that no files in `src/schach` were changed (or call out why, if the family provided updates).
