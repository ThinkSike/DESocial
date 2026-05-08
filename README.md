# DESocial

University community social platform. Monorepo: Expo mobile + Hono backend + Postgres + MinIO.

## Structure

```
desocial/
├── apps/
│   ├── mobile/        # Expo SDK 54 (React Native + Web)
│   └── server/        # Hono API + Drizzle ORM
├── packages/
│   └── shared/        # Shared types + Zod schemas
├── docker-compose.yml # PostgreSQL 16 + MinIO
├── turbo.json
└── pnpm-workspace.yaml
```

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 (`npm install -g pnpm`)
- **Docker Desktop** (for Postgres + MinIO)

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start Postgres + MinIO
pnpm docker:up

# 3. Push database schema
pnpm db:push

# 4. Seed users + communities (5 users, 6 communities)
pnpm --filter server exec tsx src/db/seed.ts

# 5. Seed image posts (40 posts with random images)
pnpm --filter server exec tsx src/db/seed-images.ts

# 6. Start dev (two terminals)
# Terminal 1: backend
pnpm dev:server

# Terminal 2: Expo
pnpm dev:mobile
```

- **Server**: http://localhost:3000
- **Mobile** (Expo): http://localhost:8081 (scan QR with Expo Go)
- **MinIO Console**: http://localhost:9003 (user: `desocial`, pass: `desocialminio`)
- **Database**: `postgres://desocial:desocial@localhost:5434/desocial`

## Test Accounts

| Email | Password |
|---|---|
| alice@desocial.app | password123 |
| bob@desocial.app | password123 |
| carol@desocial.app | password123 |

## Mobile Setup (critical)

The mobile app cannot reach `localhost` from a physical device or simulator. Do this after install:

**1. Find your LAN IP:**
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -match "^192\.168\." }
```

**2. Create `apps/mobile/.env`:**
```
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3000
```

**3. Update `apps/server/.env` — change all `192.168.0.225` to your IP:**
```
S3_PUBLIC_URL=http://YOUR_LAN_IP:3000/uploads
```

**4. Re-run the image seed so stored URLs use your IP:**
```bash
pnpm --filter server exec tsx src/db/seed-images.ts
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev:server` | Start backend (terminal 1) |
| `pnpm dev:mobile` | Start Expo (terminal 2) |
| `pnpm dev` | Start both (no Expo keyboard shortcuts) |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | Type-check everything |
| `pnpm docker:up` | Start Postgres + MinIO |
| `pnpm docker:down` | Stop all containers |
| `pnpm db:push` | Push Drizzle schema to DB |
| `pnpm db:studio` | Open Drizzle Studio |

## Tech Stack

| Layer | Tech |
|---|---|
| Mobile | Expo SDK 54, React Native 0.81, Expo Router |
| Backend | Hono, Drizzle ORM, PostgreSQL 16 |
| Auth | JWT (bcrypt + jsonwebtoken) |
| Storage | MinIO (S3-compatible), proxied through server |
| Monorepo | pnpm workspaces + Turborepo |
| Types | TypeScript, Zod, `@desocial/shared` package |

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Posts
- `GET /api/posts` — paginated (`?limit=20&cursor=ISO_DATE`)
- `POST /api/posts` — `{ content: { text, images?, hashtags? } }`
- `POST /api/posts/:id/like` — toggle
- `GET /api/posts/:id/like` — check if liked

### Users
- `GET /api/users/:id` — profile + stats
- `PATCH /api/users/:id` — update profile
- `GET /api/users/:id/posts`
- `POST /api/users/:id/follow`
- `DELETE /api/users/:id/follow`

### Communities
- `GET /api/communities`
- `GET /api/communities/:id`
- `POST /api/communities`
- `POST /api/communities/:id/join`
- `DELETE /api/communities/:id/leave`

### Uploads
- `POST /uploads?type=posts` — multipart form, returns `{ url, filename }`
- `GET /uploads/:type/:filename` — serves from MinIO

## Troubleshooting

### Expo keyboard shortcuts not working (`r`, `a`, `i`)
`pnpm dev` uses Turbo which combines output and steals stdin. Always use **separate terminals**:
```
Terminal 1: pnpm dev:server
Terminal 2: pnpm dev:mobile
```

### Port conflicts
Check if ports are in use: `netstat -ano | findstr :5434` or `findstr :9002`
Edit `docker-compose.yml` and all `DATABASE_URL` / `S3_ENDPOINT` references if needed.

### Metro bundler stale cache
```bash
npx expo start --clear
```

### Full cache reset
```bash
Remove-Item -Recurse -Force node_modules, apps/mobile/node_modules, apps/server/node_modules, packages/shared/node_modules, pnpm-lock.yaml, apps/mobile/.expo, .expo, .turbo -ErrorAction SilentlyContinue
pnpm install
pnpm dev
```

### "Network request failed" on login
The mobile device can't reach `localhost`. Set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` to your LAN IP (see Mobile Setup above).

### Images not loading (blank space)
- iOS blocks HTTP images by default — images are proxied through the server on port 3000 (same as API)
- Make sure `S3_PUBLIC_URL` in `apps/server/.env` uses your LAN IP, not `localhost`
- Re-run `seed-images.ts` after changing the IP

### "Encountered two children with the same key"
This was a FlatList VirtualizedList bug on native platforms. Fixed by replacing FlatList with ScrollView in PostList.tsx. If you switch back to FlatList for performance, add `keyExtractor={(item) => String(item.id)}` and `removeClippedSubviews`.

### npx "Cannot find module" errors
`npx` caches stale symlinks from pnpm's hoisted node_modules. Keep frequently-used CLI tools (`drizzle-kit`, `tsx`, `turbo`) as devDependencies. Use `pnpm dlx` for one-off tools like `knip`.
