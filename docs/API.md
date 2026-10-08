# API Documentation

## Base URL

`http://localhost:5000/api`

## Authentication

### POST /auth/register

Request body:

```json
{
  "fullName": "Ava Smith",
  "email": "ava@example.com",
  "password": "StrongPass123"
}
```

Response:

```json
{
  "message": "User registered successfully.",
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "fullName": "Ava Smith",
    "email": "ava@example.com",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### POST /auth/login

Request body:

```json
{
  "email": "ava@example.com",
  "password": "StrongPass123"
}
```

### GET /auth/me

Requires bearer token.

### POST /auth/logout

Requires bearer token.

## Projects

### GET /projects

Returns all projects owned by the authenticated user.

### POST /projects

Request body:

```json
{
  "name": "Website Redesign",
  "description": "Update landing page styling",
  "status": "IN_PROGRESS",
  "startDate": "2026-10-01T00:00:00.000Z",
  "endDate": "2026-10-31T00:00:00.000Z"
}
```

### PUT /projects/:id

Updates the specified project.

### DELETE /projects/:id

Deletes the project and its associated tasks.

## Tasks

### GET /tasks

Optional query parameters: `status`, `priority`, `projectId`, `search`.

### POST /tasks

Request body:

```json
{
  "name": "Add login flow",
  "description": "Set up login UI and API integration",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2026-10-11T00:00:00.000Z",
  "projectId": "project-uuid"
}
```

### PUT /tasks/:id

Updates the task.

### DELETE /tasks/:id

Deletes the task.

## Dashboard

### GET /dashboard

Returns summary counts for the authenticated user.

Response:

```json
{
  "totalProjects": 4,
  "totalTasks": 12,
  "completedTasks": 6,
  "pendingTasks": 6,
  "inProgressProjects": 2
}
```
