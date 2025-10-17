# Contributing to PhotoWake

Thank you for taking the time to contribute! This document outlines how to work with the project and how our refreshed automation behaves.

## Branch strategy

- **`main`** holds production-ready code. Every merge must come through a Pull Request that passes all required status checks.
- **`dev`** collects work that is ready for a preview release. Merges into `dev` automatically ship a Vercel preview and publish a development Docker image.

## Required quality checks

Before opening a Pull Request, please make sure the same checks that run in CI pass locally:

```bash
# Frontend
cd web
pnpm install
pnpm lint
pnpm test --if-present
pnpm build

# Backend
cd ../server
pnpm install
pnpm lint
pnpm test
pnpm build
```

These commands mirror the `PR Pipeline / Web quality gates` and `PR Pipeline / Server quality gates` GitHub Actions jobs. Keeping them green ensures a smooth review process and unblocks merges into protected branches.

## Deployment workflows

- **Preview deploys**: pushing to `dev` (or triggering the `Release` workflow manually with the branch set to `dev`) deploys the web application to Vercel's preview environment and builds a backend container tagged `dev-<short-sha>` on GitHub Container Registry (GHCR).
- **Production deploys**: pushing to `main` (or manually running the `Release` workflow against `main`) deploys the web application to the Vercel production environment and publishes a backend container tagged `prod-<short-sha>` and `latest` on GHCR.

Both release paths rely on the following repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_WEB_PROJECT_ID`
- `GHCR_PAT`

Make sure repository administrators keep these values up to date; the workflows will fail without them.

## Versioning & traceability

The release workflow emits the exact image reference (`ghcr.io/<owner>/<repo>-server:<tag>`) and digest in the job summary for every deployment. Tags use the short Git commit SHA and the target environment:

- `dev-<short-sha>` for preview builds
- `prod-<short-sha>` for production builds
- `latest` is refreshed only on successful production releases

This makes it easy to correlate running containers with the code that produced them.

## Status checks for protected branches

To keep `main` healthy, configure branch protection so that the following jobs are required status checks:

- `PR Pipeline / Web quality gates`
- `PR Pipeline / Server quality gates`

With these checks in place, every merge to `main` is guaranteed to pass linting, tests, and production builds for both the frontend and backend.
