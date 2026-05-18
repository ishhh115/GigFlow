# GigFlow API Documentation

Base URL: `https://gigflow-94qh.onrender.com/api`

## Authentication

### Register
`POST /auth/register`

Request:
```json
{
  "name": "Isha Parveen",
  "email": "isha@test.com",
  "password": "password123"
}
```
Response:
```json
{
  "user": { "id": "...", "name": "Isha Parveen", "role": "staff" },
  "token": "eyJhbGc..."
}
```

### Login
`POST /auth/login`

Request:
```json
{
  "email": "admin@test.com",
  "password": "password123"
}
```
Response:
```json
{
  "user": { "id": "...", "name": "Admin", "role": "admin" },
  "token": "eyJhbGc..."
}
```

---

## Leads
All leads endpoints require `Authorization: Bearer <token>` header.

### Get All Leads
`GET /leads`

Query params:

| Param | Type | Description |
|-------|------|-------------|
| search | string | Search by name or email |
| status | string | Filter by status (New/Contacted/Qualified/Lost) |
| source | string | Filter by source (Website/Instagram/Referral) |
| sort | string | latest or oldest |
| page | number | Page number (default: 1) |

Response:
```json
{
  "leads": [...],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

### Get Single Lead
`GET /leads/:id`

Response:
```json
{
  "_id": "...",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "Qualified",
  "source": "Instagram",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Create Lead
`POST /leads`

Request:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Website"
}
```

### Update Lead
`PUT /leads/:id`

Request: same as Create Lead.

### Delete Lead
`DELETE /leads/:id` — Admin only

### Export CSV
`GET /leads/export/csv` — Admin only

Downloads a `.csv` file of all leads.