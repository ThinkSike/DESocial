FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
WORKDIR /app

FROM base AS builder

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/server/package.json apps/server/
COPY apps/server/tsconfig.json apps/server/
COPY packages/shared/package.json packages/shared/
COPY packages/shared/tsconfig.json packages/shared/

RUN pnpm install --frozen-lockfile

COPY apps/server/src apps/server/src/
COPY packages/shared/src packages/shared/src/

RUN pnpm --filter @desocial/shared build
RUN pnpm --filter @desocial/server build
RUN pnpm --filter @desocial/server deploy /prod

FROM node:22-alpine AS runner
COPY --from=builder /prod /app
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
