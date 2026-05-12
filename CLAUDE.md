# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DeSCin is a decentralized science (DeSci) blockchain platform enabling tokenized investment in research projects. It has three main layers: a C++ blockchain node with proof-of-work consensus, a REST API, and a React/TypeScript frontend dashboard.

## Build & Run Commands

### Backend (C++17 / CMake)
```bash
cmake -B build && cmake --build build
```
Produces three executables: `descin_blockchain`, `descin_api`, `projeto_descin_app`.

### API server
```bash
./build/descin_api          # listens on $PORT, default 8080
```

### Tests (GoogleTest)
```bash
./build/descin_tests        # run all tests
```

### Frontend (React / Vite)
```bash
cd frontend
npm install
npm run dev     # dev server; proxies /api/* to localhost:18080
npm run build
npm run lint
```

### Docker
```bash
docker build -t descin-api .
docker run -p 8080:8080 descin-api
```

## Architecture

### Directory Layout
```
backend/
  blockchain-core/   # Block, Blockchain, Transaction, Wallet (RSA keypairs, PoW)
  projects-core/     # Project state, investment/refund transaction types
api/
  controllers/       # Thin HTTP handlers — delegate to services
  routes/            # Route registration (Crow framework)
  services/          # Business logic, calls database layer
database/
  supabase/          # libpqxx PostgreSQL client, AES-256 encryption utils
frontend/
  src/
    pages/           # Dashboard, ProjectExplorer, WalletPage, FounderDashboard, Curation
    stores/          # Zustand global state (auth, projects, wallet) with localStorage persist
    services/        # API client functions called by stores
```

### Data Flow
HTTP request → Crow route → Controller → Service → Database (libpqxx/Supabase)

Frontend: React page → Zustand store action → service function → `/api/*` (proxied to API in dev)

### Key Patterns
- **MVC in API layer**: Routes register controllers; controllers call services; services own DB access.
- **NLOHMANN_DEFINE_TYPE macros** used for JSON (de)serialization of all models.
- **Shared-pointer deques** manage the blockchain chain internally.
- **Custom AES-256 encryption** wraps all block data before PostgreSQL storage.
- **Zustand stores** use the `persist` middleware — state survives page refreshes via localStorage.
- **Mock mode**: set `VITE_USE_MOCKS=true` in the frontend env to bypass the API entirely during UI development.

### Roles & Auth
Three user roles: `investor`, `founder`, `curator`. Auth supports email/password plus Google and GitHub OAuth callbacks.

## Environment Variables

| Variable | Location | Purpose |
|---|---|---|
| `PORT` | API process | HTTP listen port (default 8080) |
| `VITE_API_URL` | `frontend/.env` | Base URL for API in production |
| `VITE_USE_MOCKS` | `frontend/.env` | `true` to use mock data (no backend needed) |
| DB connection string | `database/supabase/supabase.env` | PostgreSQL/Supabase credentials |

## Deployment

- **API**: Docker image deployed to Fly.io (512 MB RAM, shared CPU). CI/CD via `.github/workflows/deploy-api.yaml`.
- **Frontend**: Deployed to Vercel; `vercel.json` rewrites all routes to `/index.html` for SPA routing.
