# Assignment 2 – Full Auth.js Backend (SvelteKit + Drizzle + PostgreSQL + Vercel AI / Gemini)

Production-ready backend implementing all required features for your assignment. Frontend (SvelteKit + Tailwind) can consume these REST-style routes.

## Tech Stack
- **SvelteKit** (TypeScript)
- **Auth.js (@auth/sveltekit)** with **database sessions** (no JWT)
- **Drizzle ORM** + **PostgreSQL**
- **OAuth**: Google & GitHub
- **Email flows**: verification & password reset (SMTP via Nodemailer)
- **AI Chat**: Vercel AI SDK + Gemini
- **Role-Based Access Control**: `user` & `admin` + disable flag
- **Docker** for local Postgres

---

## Fresh-Clone Validation

```bash
cp .env.example .env             # fill required secrets
pnpm db:start                    # starts Postgres via Docker
pnpm install
pnpm db:push                     # push schema
pnpm dev
```

### Required ENV
- `DATABASE_URL`
- `AUTH_SECRET` (32+ random chars)
- `GITHUB_ID`, `GITHUB_SECRET`
- `GOOGLE_ID`, `GOOGLE_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- `APP_BASE_URL` (e.g., http://localhost:5173)
- `GEMINI_API_KEY`

> **Tip:** for Gmail, create an App Password or use a proper SMTP service (SendGrid/Mailgun/etc).

---

## Directory Structure

```
src/
  lib/
    auth.ts                # Auth.js config (DB sessions + providers)
    db/
      index.ts             # Postgres + Drizzle client
      schema.ts            # Drizzle schema incl. users/sessions/accounts/tokens
    email/
      mailer.ts            # Nodemailer transport + sendMail helper
    utils.ts               # helpers (absoluteUrl, token, etc)
    validators.ts          # zod schemas for payloads
  routes/
    api/
      auth/
        [...auth]/+server.ts       # Auth.js route (signIn/signOut/etc)
        signup/+server.ts          # Email+password signup + email verification
      email/
        verify/+server.ts          # Verify email via token
      password/
        reset/
          request/+server.ts       # Request reset link
          confirm/+server.ts       # Confirm reset with token
      profile/+server.ts           # GET/PUT profile (protected)
      admin/
        users/+server.ts           # GET list + basic stats (admin)
        users/[id]/role/+server.ts # PATCH role (admin)
        users/[id]/status/+server.ts# PATCH disable/enable (admin)
      chat/+server.ts              # AI chat (Gemini via Vercel AI SDK)
```

---

## API – How Frontend Should Use Each Endpoint

> All endpoints are **JSON** unless stated. For protected routes, send current session cookie (Auth.js manages it automatically in SvelteKit via `fetch` from load/actions).

### Auth (Auth.js)
- `GET/POST /api/auth/*` — handled by Auth.js. Use the standard Auth.js client on front-end.
  - **Sign-in (credentials)**: call `signIn('credentials', { email, password })`.
  - **Sign-in (OAuth)**: `signIn('github')` or `signIn('google')`.
  - **Sign-out**: `signOut()`.

### Signup (Email + Password with Verification)
- `POST /api/auth/signup`
  - **Body:** `{ "name": "Haris", "email": "haris@example.com", "password": "secret123" }`
  - **Response:** `{ ok: true, userId }`
  - **Flow:** sends a verification email. User must click link before credentials login works.

### Email Verification
- `GET /api/email/verify?token=...&email=...`
  - Opens a simple text response. Frontend may redirect user to `/login` afterwards.

### Password Reset
- `POST /api/password/reset/request`
  - **Body:** `{ "email": "haris@example.com" }`
  - **Response:** `{ ok: true }` (no leakage if email doesn't exist)
- `POST /api/password/reset/confirm`
  - **Body:** `{ "token": "<from-email>", "password": "newStrongPass" }`
  - **Response:** `{ ok: true }`

### Profile (Protected)
- `GET /api/profile` → `{ user: { id, name, email, image, role, disabled } }`
- `PUT /api/profile` body `{"name":"New Name","image":"https://..."}` → `{ ok: true }`

### Admin (Protected; `role === 'admin'`)
- `GET /api/admin/users` → `{ users: [...], stats: { total, disabled } }`
- `PATCH /api/admin/users/:id/role` body `{"role":"admin"|"user"}` → `{ ok: true }`
- `PATCH /api/admin/users/:id/status` body `{"disabled": true|false}` → `{ ok: true }`

### AI Chat (Protected)
- `POST /api/chat`
  - **Body (non-stream):** `{ "messages":[{ "role":"user","content":"Hi" }], "stream": false }`
  - **Response:** `{ "text": "..." }`
  - **Body (stream):** `{ "messages":[...], "stream": true }`
  - **Response:** **streamed** (use Vercel AI SDK client helpers on the frontend).

---

## RBAC & Route Protection

- Sessions are **database-backed** (table `sessions`).
- `role` in `users` table: `"user"` | `"admin"`.
- Disabled users cannot sign in via credentials (and you can extend callback to block OAuth sign-ins if needed).
- Admin-only endpoints check `session.user.role === 'admin'` in the handlers.

---

## Database Notes

- Uses **Drizzle ORM** with a Postgres schema (`src/lib/db/schema.ts`).
- Run `pnpm db:push` to create/update tables.
- Open **Drizzle Studio** with `pnpm db:studio` for a GUI (no PGAdmin required).

---

## Email

- Configure SMTP in `.env`.
- Emails are plain HTML links for verification/reset; replace templates in `src/lib/email/mailer.ts` for branded emails.

---

## Extensibility (Suggested “Extensions” from Assignment)

- **Streaming responses** are supported by `/api/chat` when `stream: true` (uses `streamText`).
- **Database chat storage**: Add a `messages` table and persist per `session.user.id` inside the chat handler.
- **Tree-structured history**: Add `parent_id` to a `messages` table; allow branching UI.

---

## CI / Conventional Commits

- Use branches `feature/*`, open PRs to `main`, enforce passing CI (GitHub Actions).

---

## Troubleshooting

- **`Invalid origin / trustHost`**: ensure `APP_BASE_URL` matches your dev URL.
- **Login stuck after signup**: user must verify email first.
- **OAuth callback errors**: verify provider IDs/secrets and OAuth redirect URLs.
- **Emails not arriving**: check SMTP creds, spam folder, or use a proper email service.
