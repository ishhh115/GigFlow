# GigFlow — Smart Leads Dashboard

A full-stack lead management dashboard to manage leads, filter and export data, and control access with role-based JWT authentication.

## Live Demo
- Frontend: https://gig-flow-wheat.vercel.app
- Backend API: https://gigflow-94qh.onrender.com/api
- Demo Video: https://www.loom.com/share/4683bee846e44b8ab9f32c4d7c819b22

## Test Accounts
- Admin: `admin@test.com` / `password123`
- Staff: `staff@test.com` / `password123`

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB, JWT
- Deployment: Vercel (frontend), Render (backend)

## Features
- JWT authentication with role-based access (admin / staff)
- Create, edit, delete, view leads
- Filter by status & source, search by name/email (debounced)
- Pagination
- CSV export (admin only)
- Dark mode

## Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB (local or hosted) or Docker

## Environment
Copy `.env.example` to `.env` in `server/` and set the required variables:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — backend port (default: 5000)
- `CLIENT_URL` — frontend URL for CORS (e.g., http://localhost:5173)

## Quick Start (local)

**Backend**
```bash
cd smart-leads/server
npm install
cp .env.example .env
npm run dev
```

**Frontend**
```bash
cd smart-leads/client
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

## Docker
```bash
docker-compose up --build
```

## API Examples

**Login**
```bash
curl -X POST https://gigflow-94qh.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

**Get leads**
```bash
curl https://gigflow-94qh.onrender.com/api/leads \
  -H "Authorization: Bearer <TOKEN>"
```

**CSV export (admin only)**
```bash
curl https://gigflow-94qh.onrender.com/api/leads/export \
  -H "Authorization: Bearer <ADMIN_TOKEN>" -o leads.csv
```

## Contact
For questions or feedback, open an issue or contact the maintainer.