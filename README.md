# DESocial

A social platform built for university communities. Monorepo with Expo mobile app + Hono backend + Postgres.

## Structure

```
desocial/
├── apps/
│   ├── mobile/        # Expo SDK 54 (React Native + Web)
│   └── server/        # Hono API + Drizzle ORM
├── packages/
│   └── shared/        # Shared types + Zod schemas
├── docker-compose.yml # PostgreSQL 16
├── turbo.json         # Turborepo config
└── pnpm-workspace.yaml
```

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 (`npm install -g pnpm`)
- **Docker** (for Postgres)

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start Postgres
pnpm docker:up

# 3. Push database schema
pnpm db:push

# 4. Seed sample data (5 users, 6 communities, 12 posts)
pnpm --filter server exec tsx src/db/seed.ts

# 5. Start everything
pnpm dev
```

- **Server**: http://localhost:3000
- **Mobile** (Expo): http://localhost:8081
- **Database**: `postgres://desocial:desocial@localhost:5434/desocial`

## Test Accounts

| Email | Password |
|---|---|
| alice@desocial.app | password123 |
| bob@desocial.app | password123 |
| carol@desocial.app | password123 |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start server + mobile in dev mode |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm docker:up` | Start Postgres container |
| `pnpm docker:down` | Stop Postgres container |
| `pnpm db:push` | Push Drizzle schema to DB |
| `pnpm db:studio` | Open Drizzle Studio (DB browser) |

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | Expo SDK 54, React Native 0.81, Expo Router |
| Backend | Hono, Drizzle ORM, PostgreSQL |
| Auth | JWT (bcrypt + jsonwebtoken) |
| Storage | Local filesystem (`apps/server/uploads/`) |
| Monorepo | pnpm workspaces + Turborepo |
| Types | TypeScript, Zod, shared `@desocial/shared` package |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Posts
- `GET /api/posts` — List posts (paginated)
- `POST /api/posts` — Create post
- `POST /api/posts/:id/like` — Toggle like
- `DELETE /api/posts/:id` — Delete post

### Users
- `GET /api/users/:id` — Get user profile
- `PATCH /api/users/:id` — Update profile
- `GET /api/users/:id/posts` — Get user's posts
- `POST /api/users/:id/follow` — Follow user
- `DELETE /api/users/:id/follow` — Unfollow

### Communities
- `GET /api/communities` — List communities
- `GET /api/communities/:id` — Get community
- `POST /api/communities` — Create community
- `POST /api/communities/:id/join` — Join community
- `DELETE /api/communities/:id/leave` — Leave

### Uploads
- `POST /uploads?type=avatars` — Upload file
- `GET /uploads/:type/:filename` — Serve file

## Troubleshooting

### Port conflict (Postgres)
If port 5434 is in use, edit `docker-compose.yml` and update all `DATABASE_URL` references.

### Mobile can't reach server
Set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` to your machine's LAN IP:
```
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
```

### Metro bundler cache issues
```bash
npx expo start --clear
```

### Stale node_modules
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules pnpm-lock.yaml
pnpm install
```
