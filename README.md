# Project Management System

This project contains a full-stack, multi-platform application for managing projects and tasks. The backend is built with Node.js + Express + Prisma + PostgreSQL, the web client is a React + Vite app, and the mobile client is a React Native + Expo app.

## Tech stack

- Backend: Node.js, Express, Prisma, PostgreSQL
- Web frontend: React + Vite
- Mobile app: Expo + React Native
- Security: JWT, bcrypt, validation, auth middleware, rate limiting, Prisma ORM

## Features

- User registration and login
- JWT-based authentication
- Project CRUD with status, start date, and end date
- Task CRUD with priority, status, and due date
- Dashboard summary cards
- Search and filtering across projects and tasks
- Shared backend used by both web and mobile apps
- Mobile secure token handling with Expo SecureStore

## Repository structure

- `backend/` – Express API and Prisma schema
- `web/` – React web client
- `mobile/` – Expo mobile app
- `docs/` – Database schema and API docs

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm
- Android Studio / Expo Go for mobile testing

## Backend setup

1. Open the `backend` folder.
2. Copy `.env.example` to `.env`.
3. Update `DATABASE_URL` to match your PostgreSQL instance.
4. Install dependencies:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The backend will run at `http://localhost:5000`.

## Web app setup

```bash
cd web
npm install
npm run dev
```

Set a Vite environment variable if needed:

```bash
VITE_API_URL=http://localhost:5000/api
```

Open the local Vite URL shown in the terminal.

## Mobile app setup

```bash
cd mobile
npm install
EXPO_PUBLIC_API_URL=http://localhost:5000/api npx expo start
```

For Android, either use Expo Go or build an APK with EAS.

## Environment variables

### Backend (.env)

```env
PORT=5000
JWT_SECRET=replace_with_a_secure_secret
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/project_management"
CLIENT_URL=http://localhost:5173
MOBILE_CLIENT_URL=exp://192.168.1.10:8081
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Web (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Mobile (.env or shell env)

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## API endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Projects

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Dashboard

- `GET /api/dashboard`

## Database schema

See the ER diagram in [docs/ER_DIAGRAM.md](./docs/ER_DIAGRAM.md).

## Security notes

- Passwords are stored as bcrypt hashes.
- JWT is required for protected routes.
- Prisma prevents SQL injection via parameterized queries.
- Auth endpoints are rate limited.
- User data is scoped by `userId`, preventing cross-user access.

## Demo flow

1. Register a user on the web or mobile app.
2. Create a project.
3. Add tasks to that project.
4. Open the dashboard to review total counts.
5. Log in on the other client and refresh to verify shared data.

## Deployment readiness

This repository includes basic deployment configuration files:

- `render.yaml` for backend deployment on Render
- `web/vercel.json` for frontend hosting on Vercel
- `mobile/eas.json` for Android APK or app build generation with EAS

### Suggested deployment flow

1. Push the repository to GitHub.
2. Deploy the backend on Render using the `render.yaml` configuration.
3. Add your PostgreSQL connection string in Render environment variables.
4. Deploy the web app to Vercel and set `VITE_API_URL` to your Render backend URL.
5. Build the mobile app with EAS or Expo to generate the APK.
6. Record a 5-minute screen-sharing demo showing login and task synchronization across web and mobile.

## Production considerations

This project is structured as a working assessment implementation and is suitable for local development and deployment testing. Additional hardening such as CI/CD, refresh tokens, audit logs, and pagination can be added later.
