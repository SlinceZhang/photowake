# PhotoWake

![PhotoWake preview](./imgs/bg.png)

PhotoWake is a bilingual avatar builder and landing experience. The project is split into a Next.js 15 (React 19) frontend and a NestJS backend that exposes a small but growing REST API. Docker Compose and an Nginx reverse proxy tie the two services together for production deployments, while pnpm scripts keep day-to-day development fast.

> **Goal:** give a new contributor enough context to clone the repo, boot both services, explore the API via Swagger, and start shipping improvements in under 30 minutes.

---

## Architecture

### High-level topology

```mermaid
graph TD
    Browser[Browser or SSR request] -->|HTTP(S)| Nginx[Nginx Reverse Proxy]
    Nginx -->|/| Next[Next.js Frontend (web)]
    Nginx -->|/api| Nest[NestJS API (server)]
    Nest -->|Future integrations| External[(Datastores / 3rd-party services)]
    subgraph Docker Compose Stack
        Next
        Nest
        Nginx
    end
```

### Component summary

- **web/** – Next.js App Router project with next-intl powered locale routing, theme toggles, Zustand state, avatar generation UI, and axios utilities.
- **server/** – NestJS 10 service that returns standardized response envelopes and auto-generated Swagger documentation at `/docs`.
- **nginx.conf** – Reverse proxy rules used in production to serve the frontend and forward `/api` requests to the backend.
- **docker-compose.yml** – Deployment manifest defining the three-container stack used locally (optional) and in CI/CD.

---

## Repository layout

| Path | What lives here |
| --- | --- |
| `web/` | Next.js frontend (App Router, TailwindCSS, translations, SVG avatar layers) |
| `server/` | NestJS backend (REST controllers, common response helpers, Swagger bootstrap) |
| `docker-compose.yml` | Production stack definition (frontend + backend + nginx) |
| `nginx.conf` | Reference Nginx configuration consumed by Docker and remote deployments |
| `imgs/` | Static illustrations used in documentation |
| `.github/workflows/` | GitHub Actions pipeline for building and deploying containers |

---

## Prerequisites

| Tool | Recommended version |
| --- | --- |
| [Node.js](https://nodejs.org/) | ≥ 20.11 (Next.js 15 requirement) |
| [pnpm](https://pnpm.io/) | ≥ 9 (repo currently uses pnpm 10.18.3) |
| [Docker & Docker Compose](https://docs.docker.com/get-docker/) | Latest stable (optional for local dev, required for production parity) |
| Git | Latest stable |

> **Tip:** install pnpm globally: `npm install -g pnpm@latest`.

---

## Local development workflow

1. **Clone the repository**
   ```bash
   git clone https://github.com/slince-zero/photowake.git
   cd photowake
   ```

2. **Install dependencies** (frontend and backend manage their own lockfiles)
   ```bash
   pnpm --dir web install
   pnpm --dir server install
   ```

3. **Configure environment variables** (see [Environment configuration](#environment-configuration))
   ```bash
   cp web/.env.example web/.env.local
   cp server/.env.example server/.env
   ```

4. **Start both services**
   - Run everything with one command from the repo root:
     ```bash
     pnpm dev
     ```
     This uses `pnpm --filter web dev` and `pnpm --filter server dev` to launch both processes.

   - …or start them individually if you prefer separate terminals:
     ```bash
     pnpm --dir web dev         # Next.js on http://localhost:3000
     pnpm --dir server dev      # NestJS on http://localhost:3080/api
     ```

5. **Verify the stack**
   - Frontend: `http://localhost:3000`
   - API health check: `curl http://localhost:3080/api`
   - Swagger UI: `http://localhost:3080/docs`

### Useful pnpm scripts

| Scope | Command | Description |
| --- | --- | --- |
| root | `pnpm dev` | Boots frontend (Next.js) and backend (NestJS) concurrently |
| web | `pnpm --dir web dev` | Runs the Next.js dev server with Turbopack |
| web | `pnpm --dir web build` | Produces an optimized production build |
| web | `pnpm --dir web lint` | Lints the frontend codebase |
| server | `pnpm --dir server dev` | Runs the NestJS server in watch mode |
| server | `pnpm --dir server start:prod` | Starts the compiled NestJS app |
| server | `pnpm --dir server test` | Executes backend unit tests |

---

## Environment configuration

Example files are provided for both services. Copy them, update values as needed, and keep real secrets out of source control.

```bash
cp web/.env.example web/.env.local
cp server/.env.example server/.env
```

### Frontend (`web/.env.local`)

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:3080/api` | Base URL axios uses for REST calls. Exposed to the browser. |
| `NEXT_PUBLIC_API_URL_DEV` | ⛔️ (optional) | — | Uncomment if you need to point the local UI at a remote/staging API. |

### Backend (`server/.env`)

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `PORT` | ✅ | `3080` | Port listened to by NestJS. Keep aligned with Docker/Nginx expectations. |

### Production/CI secrets

These do **not** live in `.env` files:
- **`SSH_PRIVATE_KEY`** – used by the deployment job to SSH into the target server.
- **`SERVER_IP`** – host the deployment pipeline dials into.
- **`SERVER_USER`** – user with permissions to deploy Docker containers.
- **`GITHUB_TOKEN`** – automatically provided by Actions for pushing to GHCR (no manual setup required).

Store the secrets above in the GitHub repository’s *Settings → Secrets and variables → Actions* page.

---

## API documentation & response envelope

- Base path: `http://localhost:3080/api`
- Interactive docs and OpenAPI schema: `http://localhost:3080/docs`

Every HTTP response is wrapped in the standard envelope:

```json
{
  "data": <payload>,
  "message": "Optional human-friendly summary",
  "error": null
}
```

Example

```bash
curl http://localhost:3080/api | jq
```

```json
{
  "data": "hello world",
  "message": "API is reachable",
  "error": null
}
```

When creating new controllers, reuse this structure for predictable error handling on the frontend.

---

## Docker workflow

Docker is optional for day-to-day development but mirrors production closely.

### Local preview with Compose

```bash
docker compose up --build
```

- `photowake-frontend`: Next.js app served on port 3000.
- `photowake-backend`: NestJS API on port 3080 behind the `/api` prefix.
- `nginx`: Proxies `/` to the frontend and `/api` to the backend on port 80.

> **Tip:** if you want to test local changes without pushing images, swap the `image` entries in `docker-compose.yml` for `build: ./web` and `build: ./server` temporarily.

### Production deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and pushes container images to GitHub Container Registry (GHCR), SSHs into the target host, updates `docker-compose.yml`, and restarts the stack. The same manifest lives in the repo so you can test the exact configuration locally.

---

## CI/CD expectations

- Triggered on pushes and pull requests targeting `main`.
- `build` job:
  - Checks out the repo.
  - Generates a timestamp + git hash image tag.
  - Builds/pushes `web` and `server` images to GHCR.
- `deploy` job (needs `build`):
  - Uses `SSH_PRIVATE_KEY`, `SERVER_IP`, `SERVER_USER` secrets to reach the production host.
  - Uploads `docker-compose.yml`, swaps images to the freshly built tag, and runs `docker-compose up -d --force-recreate`.
  - Performs an HTTP health check against `http://<SERVER_IP>/health`.

### Contributor checklist before opening a PR

- `pnpm --dir web lint`
- `pnpm --dir server test`
- Verify `pnpm dev` boots both services without runtime errors.
- Ensure documentation stays in sync when new env vars or routes are introduced.

---

## Data & migrations

The API currently serves stateless responses and does not connect to a persistent datastore yet. When persistence is introduced, follow these conventions:

1. Add your ORM/SDK dependencies inside `server/` and expose pnpm scripts such as `pnpm --dir server migrate:dev` and `migrate:deploy`.
2. Document any new required environment variables in `server/.env.example` and the table above.
3. Update this section with:
   - How to generate migrations.
   - How to apply migrations locally and in CI/CD (e.g., `pnpm --dir server migrate:deploy`).
4. Prefer idempotent migrations so the deployment workflow can run them safely before reloading containers.

Until then, no database setup is required to run the project locally or in Docker.

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| **Locale routing error** – Next.js 15 requires awaiting async route params (`Route "/[locale]" used params.locale`). | Run `npx @next/codemod@canary next-async-request-api web` and ensure components await the params object before reading properties. |
| **Ports already in use** when starting dev servers. | Stop other services on ports 3000/3080 or export new values (`export PORT=4080` + update `NEXT_PUBLIC_API_URL`). |
| **Axios requests hit the wrong endpoint**. | Double-check `NEXT_PUBLIC_API_URL` in `web/.env.local` and restart the dev server so Next.js reloads environment variables. |
| **Swagger UI 404s**. | Ensure the backend is running (`pnpm --dir server dev`) and the Nest app boot logs show `Nest application successfully started`. Swagger is served from the same process. |
| **Docker Compose cannot pull images**. | Authenticate with GHCR (`echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin`) or switch to local builds by adding `build:` entries in `docker-compose.yml`. |

---

## License

PhotoWake is released under the [MIT License](./LICENSE).
