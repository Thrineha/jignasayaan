# Security Notes

This scaffold is built with security as a first-class constraint, not an
afterthought. Before going to production, walk this checklist and treat
nothing here as "done" without your own review — a template can't know your
threat model.

## Transport & edge
- Nginx is the only container with a published port. Terminate TLS there
  (mount real certs — see `nginx/nginx.conf` comments for where cert-manager
  / Let's Encrypt / your CDN's cert goes) and redirect all HTTP → HTTPS.
- `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, and a locked-down `Content-Security-Policy` are set at
  both nginx and the Express/Helmet layer (defense in depth).
- Basic rate limiting (`limit_req`) at nginx protects against volumetric
  abuse before it ever reaches the app.

## Application (backend)
- **Helmet** sets secure headers on every response; CSP is explicit (no
  `unsafe-inline` beyond what Next.js strictly requires — tighten with
  nonces before launch).
- **CORS** is an explicit origin allow-list read from `ALLOWED_ORIGINS`, not
  a wildcard.
- **Rate limiting** per route via `express-rate-limit`, tighter on
  `/api/registrations` (write endpoint) than on read endpoints.
- **Input validation**: every request body is parsed through a Zod schema
  before touching business logic. Anything that fails validation is
  rejected with a generic 400 — no reflected user input, no stack traces.
- **SQL**: all queries use parameterized statements via `pg` — never string
  concatenation. No raw user input reaches a query string.
- **Body size limits** on JSON parsing (`express.json({ limit: '100kb' })`)
  to blunt payload-based DoS.
- **Error handling**: a single centralized error handler returns generic
  messages to clients and logs full detail server-side only.
- **Secrets**: read exclusively from environment variables (`process.env`),
  never committed. `.env` is git-ignored; `.env.example` documents the shape
  without real values.

## Containers
- Every Dockerfile creates and runs as a **non-root user**.
- Multi-stage builds keep `node_modules` dev dependencies and build tooling
  out of the final runtime image.
- `docker-compose.yml` puts Postgres and the backend on an **internal-only**
  network (`internal: true` for the db network) — Postgres has no host port
  mapping at all.
- Healthchecks are defined so orchestration can detect and restart failing
  containers automatically.

## Data
- Passwords/OTPs (once implemented) must be hashed with **bcrypt/argon2**,
  never stored in plaintext — the `users` table placeholder in `init.sql`
  reflects this (`password_hash`, not `password`).
- Payment must go through a certified provider's hosted checkout/SDK
  (Razorpay/Stripe) so raw card/UPI data never touches this server —
  the WRD's "QR payment" flow should redirect to the provider, not collect
  payment details directly.
- PII (student details, parent contacts) should be encrypted at rest if your
  hosting provider doesn't already do so at the volume level, and access to
  the admin panel must be role-gated (not built in this scaffold — flagged
  as a TODO in `backend/src/routes`).

## Before production
- [ ] Replace all placeholder secrets in `.env`
- [ ] Add authentication (JWT/session) + RBAC for School/Volunteer/Admin
      dashboards before implementing those routes
- [ ] Add OTP verification (SMS/email provider) for registration
- [ ] Add a WAF/CDN (Cloudflare, per the WRD) in front of nginx
- [ ] Run `npm audit` / `docker scout` in CI and pin dependency versions
- [ ] Set up centralized logging + alerting (no PII in logs)
- [ ] Load test the registration endpoint before a real registration rush
