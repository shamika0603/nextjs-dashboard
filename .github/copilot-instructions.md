### Purpose
Short, actionable guidance for AI coding agents working on this Next.js app-router dashboard.

### Big picture
- This is a Next.js (app router) dashboard demo (root: `app/`). UI components live under `app/ui/`. Server data helpers and SQL live under `app/lib/` (see `app/lib/data.ts` and `app/lib/actions.ts`).
- Authentication is implemented with NextAuth in `auth.ts` + `auth.config.ts` and applied as middleware in `middleware.ts`.
- Database access uses the `postgres` package and raw SQL queries (see `app/lib/data.ts`). Money is stored in cents (format helpers in `app/lib/utils.ts`).

### Key workflows & commands
- Local dev: `pnpm dev` (script `dev` runs `next dev --turbopack`).
- Build: `pnpm build` → `next build`. Start: `pnpm start`.
- Lint: `pnpm lint` (uses eslint). See `package.json` for scripts.
- DB checks: `scripts/test-db.js` and `scripts/test-cd.js` demonstrate how `POSTGRES_URL` and `POSTGRES_SSL` are used — useful for local debugging.

### Environment & runtime notes
- Required envs: `POSTGRES_URL` (used throughout `app/lib/*`, `auth.ts`, `app/seed/route.ts`). If missing, functions throw a clear error.
- Optional: `POSTGRES_SSL` (set `false` for local non-SSL DB). NextAuth picks up `AUTH_*`/`NEXTAUTH_*` aliases (see NextAuth docs and runtime code in compiled bundles).

### Project-specific conventions
- Server/client separation: keep DB calls and NextAuth logic on the server (files in `app/lib/*`, `auth.ts`). UI components under `app/ui/*` may be client components (`'use client'`) — check the top of the file.
- Form mutations use server actions and Zod validation (see `app/lib/actions.ts`): server actions use `'use server'`, call SQL, then `revalidatePath()` and `redirect()`.
- Amounts: store as integer cents in DB; convert in UI with `formatCurrency` in `app/lib/utils.ts`.
- Pagination: helper `generatePagination` in `app/lib/utils.ts` and `ITEMS_PER_PAGE` in `app/lib/data.ts`.

### Integration points to watch
- `auth.ts` exports `{ auth, signIn, signOut }` used by `app/ui/*` (e.g. login form and side nav sign-out form). Changing auth shapes affects many components.
- `app/query/route.ts` and `app/seed/route.ts` are server route handlers that call the same `postgres` usage pattern — use them as examples when adding routes.

### When editing code (rules for AI agents)
1. Preserve server/client boundaries: move DB or auth code into `app/lib/` or `auth.ts` (server). Don't add direct DB calls to components that are client-only.
2. Use Zod for form validation to keep consistent error shapes (examples in `app/lib/actions.ts`).
3. When mutating data, call `revalidatePath('/dashboard/invoices')` (or the affected path) and use `redirect()` as shown in `app/lib/actions.ts`.
4. Keep money conversions consistent: accept dollars in forms, multiply by 100 before SQL; when reading from SQL divide by 100 for UI.
5. Add tests or a scripts example when changing DB schema; `scripts/test-db.js` shows a minimal connectivity check.

### Files to consult for examples
- Server actions & validation: `app/lib/actions.ts`
- Data access patterns & lazy DB init: `app/lib/data.ts`
- Formatting & helpers: `app/lib/utils.ts`
- Client login form: `app/ui/login-form.tsx`
- Invoices table + UI actions: `app/ui/invoices/table.tsx` and `app/ui/invoices/buttons.tsx`
- Auth wiring: `auth.ts`, `auth.config.ts`, `middleware.ts`

If anything here is incomplete or you'd like more examples (SQL schema, env setup, or tests), tell me which area to expand.
