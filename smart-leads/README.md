# GigFlow — Smart Leads Dashboard

A full-stack lead management dashboard built for the ServiceHive internship assignment. Manage leads, filter and export data, and control access with role-based JWT authentication.

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB, JWT
- Deployment: Vercel (frontend), Railway (backend) / Docker Compose for local development

## Features
- JWT authentication with role-based access (admin / staff)
- Create, edit, delete, view leads
- Filter by status & source, search by name/email (debounced)
- Pagination
- CSV export (admin only)
- Dark mode

## Test Accounts
- Admin: `admin@test.com` / `password123`
- Staff: `staff@test.com` / `password123`

## Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB (local or hosted) or Docker

## Environment
Copy `.env.example` to `.env` in both `server/` and set the required variables. Typical variables:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — backend port (default: 5000)
- `CLIENT_URL` — frontend URL for CORS (e.g., http://localhost:5173)

See `server/.env.example` for the exact keys.

## Quick Start (local)

Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env as needed
npm run dev
```

Frontend

```bash
cd client
npm install
cp .env.example .env
# Edit .env as needed
npm run dev
```

After both start, frontend runs at `http://localhost:5173` and backend at `http://localhost:5000` by default.

## Docker (optional)
If you prefer Docker, the repository includes a `docker-compose.yml`. Launch both services with:

```bash
docker-compose up --build
```

## API Examples

Login (get JWT)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

Get leads (authenticated)

```bash
curl http://localhost:5000/api/leads \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

CSV export (admin only)

```bash
curl http://localhost:5000/api/leads/export \
  -H "Authorization: Bearer <ADMIN_TOKEN>" -o leads.csv
```

## Database / Seeding
Provide a `MONGO_URI` pointing to a local or cloud MongoDB. If you need test data, add a small seeder script under `server/utils` or run the app and create accounts via the Register UI.

## Contributing
- Fork the repository, open a branch, and send a PR.
- Run linters and tests (if present) before submitting.

## Tests
There are no automated tests included by default. Add tests under `server/` or `client/` as needed and document commands here.

## Screenshots / Demo
Add screenshots or a demo link here when available.

## Contact
 For questions or feedback, open an issue or contact the maintainer.

