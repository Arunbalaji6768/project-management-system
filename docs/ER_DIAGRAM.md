# Database Schema / ER Diagram

```mermaid
erDiagram
  USER ||--o{ PROJECT : owns
  USER ||--o{ TASK : owns
  PROJECT ||--o{ TASK : contains

  USER {
    string id PK
    string fullName
    string email UK
    string password
    datetime createdAt
    datetime updatedAt
  }

  PROJECT {
    string id PK
    string name
    string description
    enum status
    datetime startDate
    datetime endDate
    datetime createdAt
    datetime updatedAt
    string userId FK
  }

  TASK {
    string id PK
    string name
    string description
    enum priority
    enum status
    datetime dueDate
    datetime createdAt
    datetime updatedAt
    string projectId FK
    string userId FK
  }
```

## Notes

- Each project belongs to one user.
- Each task belongs to one project and one user.
- Users can view only their own projects and tasks.
- The DB uses Postgres enums for project and task status values.
