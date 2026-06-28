# DevPulse

> A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

Live Link: `https://devpulse-omega-six.vercel.app/`

---

## Features

- User registration & login with JWT authentication
- Role-based access control (`contributor` / `maintainer`)
- Create, view, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- Secure password hashing with bcrypt
- PostgreSQL database with connection pooling

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| TypeScript | Type-safe development |
| Express.js | Web framework |
| PostgreSQL | Relational database |
| pg | Native PostgreSQL driver |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variables |

##  API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues |
| GET | `/api/issues/:id` | Public | Get single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

### Query Parameters (GET /api/issues)

| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | none |
| `status` | `open`, `in_progress`, `resolved` | none |


## Database Schema

### Table: `users`

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | Auto-increment ID |
| `name` | VARCHAR(100) NOT NULL | Full name |
| `email` | VARCHAR(150) UNIQUE NOT NULL | Login email |
| `password` | TEXT NOT NULL | Hashed password |
| `role` | VARCHAR(20) DEFAULT `contributor` | `contributor` or `maintainer` |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-updated |

### Table: `issues`

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | Auto-increment ID |
| `title` | VARCHAR(150) NOT NULL | Issue headline |
| `description` | TEXT NOT NULL | Detailed description |
| `type` | VARCHAR(20) NOT NULL | `bug` or `feature_request` |
| `status` | VARCHAR(20) DEFAULT `open` | `open`, `in_progress`, `resolved` |
| `reporter_id` | INTEGER NOT NULL | References users.id |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-updated |

---

## Project Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   └── issues/
│       ├── issues.routes.ts
│       ├── issues.controller.ts
│       └── issues.service.ts
├── middleware/
│   └── auth.middleware.ts
├── utils/
│   └── response.ts
├── db/
│   └── db.ts
├── config/
│   └── index.ts
├── app.ts
└── server.ts
```