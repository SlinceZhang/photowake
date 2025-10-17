# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN apk add --no-cache libc6-compat \
    && corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

FROM base AS prod-deps

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

FROM base AS development

ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3080

CMD ["pnpm", "run", "dev"]

FROM base AS runner

ARG PORT=3080
ENV NODE_ENV=production
ENV PORT=${PORT}

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY nest-cli.json ./nest-cli.json
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.build.json ./tsconfig.build.json

EXPOSE 3080

CMD ["pnpm", "run", "start:prod"]
