# Repository Guidelines

## Project Structure & Module Organization

Schachmeister is an educational Vite + React app. `main.tsx` mounts `src/ui/App.tsx`. Agents own everything in `src/ui`; the kids guard `src/schach` (treat it as read-only). Share test setup from `src/test` and keep UI specs in `src/ui/__tests__`. Assets go under `src/assets`, builds land in `dist/`, and static files stay in `public/`. Styling uses Tailwind.

## Educational Mission & Collaboration Boundaries

Protect the teaching goal behind this repo. Never modify `src/schach` unless the family supplies a patch—that folder owns rules and terminology. When UI work needs new hooks into game logic, request the interfaces you need and document expectations so the kids can implement them.

## Coding Style & Naming Conventions

Use TypeScript everywhere with explicit exports as in `src/schach/types.ts`. Keep components functional, prop-typed, and housed in `src/ui`. Indent with two spaces, prefer double quotes. Style with Tailwind utilities; extract wrappers only when repetition appears—avoid new CSS files unless Tailwind truly falls short. Preserve the German domain names (`brett`, `figur`) and let the kids propose renames.

## Testing Guidelines

Vitest (with jsdom) plus React Testing Library power the UI checks. Use `npm run test` for single runs, and keep specs near the UI they cover under `src/ui/__tests__`. Extend assertions via `src/test/setup.ts`, and focus on DOM or rendered state rather than chess rules (those stay in the kids' domain). Always make sure `npm run check` still succeeds before handing off work.
