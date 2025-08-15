# Auth.js + SvelteKit Monorepo (Single Dev Command)

One fullstack SvelteKit app (frontend + backend API) with:
- Auth.js (DB sessions, **no JWT**)
- Drizzle ORM + PostgreSQL
- OAuth (Google/GitHub), Email verification, Password reset
- AI Chat via Vercel AI SDK (Gemini)
- TailwindCSS
- Admin role & dashboard

## Quick Start

```bash
cp apps/web/.env.example apps/web/.env
pnpm db:start             # start Postgres in Docker
pnpm install
pnpm db:push
pnpm run dev --open       # single command opens the app
```

## Project Layout
```
authjs-sveltekit-monorepo/
  apps/
    web/        # SvelteKit fullstack app
```

All REST endpoints live under `apps/web/src/routes/api/*`. UI pages in `apps/web/src/routes/*`.

## Tailwind
Already wired via `src/app.css`, `tailwind.config.cjs`, `postcss.config.cjs`.

## Notes
- Ensure OAuth callback URLs point to your dev URL (e.g., http://localhost:5173/api/auth/callback/github).
- Use Drizzle Studio: `pnpm db:studio`.
- Emails: configure SMTP in `.env`. Verification/reset emails are simple HTML links.
- Chat uses Gemini 1.5 Flash by default; set `GEMINI_API_KEY`.
