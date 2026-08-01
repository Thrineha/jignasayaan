# Jignasayaan — South India's Largest Student Yaan

Full-stack bootstrap for the Jignasayaan expedition platform, built from the
Website Requirements Document. This is a **production-shaped scaffold**: the
architecture, security hardening, Docker setup, and homepage experience are
fully wired up; several deeper sections (School/Volunteer/Admin dashboards,
payments, AI assistant, etc.) are stubbed as clearly-marked routes/components
ready to be filled in — trying to hand-build all 34 spec sections as finished
product in one pass would produce shallow, untested code across the board.

## What's included

**Frontend** (`/frontend`) — Next.js 14 (App Router) + TypeScript + Tailwind CSS
+ Framer Motion
- Cinematic full-bleed hero with the required stats (1080+ students, 50+
  institutions, 7 days, Kerala capital) and a live countdown
- Scroll-animated sections: About/Vision, Journey Timeline, Live Dashboard
  counters, Destinations, Why Join, Registration (3-step form), Footer
- **Train-style page transitions** (`components/PageTransition.tsx`) — every
  route change slides/blurs like the train pulling out of one station and
  into the next, with a quick "speed lines" flash; falls back to a plain
  fade under `prefers-reduced-motion`
- **Scroll-linked train** on the Journey Timeline — a true top-down
  (aerial/drone) view of a bullet train nose (`components/MiniTrain.tsx`;
  tapered aerodynamic hood, raked windshield patch, glossy highlight,
  pulsing side sensor lights — all original artwork), pointed downward
  to match the direction of travel, riding a real double-rail track with
  sleepers as you scroll past each of the 7 stations
- **Train-window filmstrip** (`components/TrainWindowStrip.tsx`) — a
  continuously scrolling row of "looking out the window" frames above the
  timeline, pure CSS animation (no JS cost), currently filled with
  illustrated placeholders in `public/journey/` — swap in real expedition
  photography whenever it's available (see `public/README.txt`)
- **Dynamic-Island-style live counters** (`components/DynamicIsland.tsx`) —
  a black capsule of icon+number pairs that morphs open on hover/tap to
  reveal labels, iOS Dynamic Island-style
- `/admin` — auth-gated dashboard listing registrations (real data from the
  API), with `/admin/login` and a session-cookie logout flow
- Design tokens follow the WRD spec exactly: Deep Blue / Saffron Orange /
  Emerald / Golden Yellow palette, Poppins+Sora / Inter / Space Grotesk type
- Mobile-first, keyboard-focus visible, `prefers-reduced-motion` respected

**Backend** (`/backend`) — Node.js + Express + TypeScript + PostgreSQL (`pg`)
- Registration API with strict input validation (Zod) and parameterized SQL
  (no ORM magic, no injection surface)
- Auth: bcrypt password hashing, JWT sessions in httpOnly/sameSite cookies,
  role-based middleware (`requireAuth` + `requireRole`), brute-force-resistant
  login rate limiting, and an admin-only paginated registrations list
- Security middleware: Helmet (CSP, HSTS, frame-ancestors), strict CORS
  allow-list, per-route rate limiting, request body size limits, structured
  error handling that never leaks stack traces to clients
- `/health` endpoint for container healthchecks

**Reverse proxy** (`/nginx`) — TLS termination point, security headers,
rate limiting at the edge, and the only service exposed to the internet.

**Database** — PostgreSQL 16, initialized via `backend/db/init.sql`, never
exposed outside the Docker network.

## Running locally

```bash
cp .env.example .env        # fill in real secrets before anything but local dev
docker compose up --build
```

- App: http://localhost (via nginx)
- API health check: http://localhost/api/health
- Admin dashboard: http://localhost/admin (see below to create your first admin)

### Creating the first admin user

There's no public sign-up for the admin role by design. Seed the first admin
account directly against the running backend container:

```bash
docker compose exec -e ADMIN_EMAIL=you@example.com -e ADMIN_PASSWORD='a-strong-password-12+chars' \
  backend node dist/scripts/seed-admin.js
```

This hashes the password with bcrypt and upserts the user — safe to re-run
to rotate a password. Sign in at `/admin/login`; the session is a signed
JWT in an httpOnly cookie (invisible to JS, so it can't be stolen via XSS).

## Troubleshooting

**`password authentication failed for user "jignasayaan_app"`** — almost
always means the Postgres data volume was already initialized with a
different password than what's currently in `.env`. Postgres only applies
`POSTGRES_PASSWORD` the *first* time it starts against an empty volume; it's
silently ignored on every start after that. Fix:

```bash
docker compose down -v   # wipes the local dev DB volume
docker compose up --build
```

`DATABASE_URL` is built automatically from `POSTGRES_USER`/`POSTGRES_PASSWORD`/
`POSTGRES_DB` in `docker-compose.yml` — don't set it separately in `.env`, or
it can drift out of sync with the actual Postgres credentials.

## Security posture (see SECURITY.md for detail)

- No service other than nginx publishes a port to the host/internet.
- Postgres and the backend only communicate over the internal Docker network.
- Secrets (DB password, JWT signing key, etc.) are injected via environment
  variables from `.env`, which is git-ignored — nothing is hard-coded.
- All containers run as non-root users with read-only root filesystems where
  practical.
- Helmet + strict CSP + HSTS on every response; CORS is an explicit allow-list,
  not `*`.
- Rate limiting both at nginx (edge) and Express (per-route) to blunt scraping
  and brute-force/registration-spam.
- All user input validated with Zod schemas before touching the database；
  all queries are parameterized.
- Dependencies pinned to major/minor versions in package.json; run
  `npm audit` in CI before deploy.

## What's stubbed, not built

These are represented as routes/components with TODOs, not fake data pretending
to be real:
- Payment integration (WRD calls for QR payment — needs a PCI-aware provider
  like Razorpay/Stripe chosen and wired server-side; never handle raw card data)
- OTP verification for registration
- School / Volunteer dashboards — the auth system (bcrypt + JWT + role
  middleware) and the Admin dashboard are built; School/Volunteer just need
  their own routers behind the same `requireAuth`/`requireRole` pattern
- AI Assistant, Trip Calculator, Packing Checklist widgets
- Gallery CMS ingestion, Sponsor brochure download pipeline

## Project layout

```
jignasayaan/
├── docker-compose.yml
├── .env.example
├── nginx/
│   ├── nginx.conf
│   └── Dockerfile
├── frontend/
│   ├── Dockerfile
│   └── src/
│       ├── app/            # Next.js App Router pages
│       ├── components/     # Section components
│       └── lib/
└── backend/
    ├── Dockerfile
    ├── db/init.sql
    └── src/
        ├── index.ts
        ├── routes/
        ├── middleware/
        └── lib/
```
