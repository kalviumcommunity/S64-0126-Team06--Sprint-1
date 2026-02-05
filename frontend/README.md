This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Prisma ORM Setup

### Purpose
Prisma ORM is used to interact with the PostgreSQL database in a type-safe manner. It simplifies database queries, migrations, and model management.

### Setup Steps
1.  **Installation**: Installed `prisma` CLI and `@prisma/client`.
    ```bash
    npm install prisma --save-dev
    npx prisma init
    ```
2.  **Schema Configuration**: Defined models in `prisma/schema.prisma`.
3.  **Client Generation**: Generated the Prisma client.
    ```bash
    npx prisma generate
    ```
4.  **Client Singleton**: Created `frontend/lib/prisma.ts` to ensure a single instance of Prisma Client is used in development.
5.  **Verification**: A `test-db.ts` script was created to verify the connection.

### Code Snippets

**Schema (`prisma/schema.prisma`):**
```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  createdAt DateTime  @default(now())
  projects  Project[]
}
```

**Client Initialization (`frontend/lib/prisma.ts`):**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Reflection
Prisma improves developer productivity by providing auto-completion for database queries, ensuring type safety with TypeScript, and managing database migrations easily. It reduces the likelihood of runtime errors related to database interactions.

### Verification Note
During setup, `npm install` encountered environment issues. Ensure dependencies are correctly installed by running `npm install` and `npx prisma generate` before starting the application. To verify the connection, you can run:
```bash
npx tsx test-db.ts
```

## API Documentation

### Route Hierarchy
All API endpoints are prefixed with `/api`.

-   `GET /api/users` - Fetch all users (paginated)
-   `POST /api/users` - Create a new user
-   `GET /api/users/[id]` - Fetch user by ID (includes projects and tasks)
-   `PUT /api/users/[id]` - Update user by ID
-   `DELETE /api/users/[id]` - Delete user by ID
-   `GET /api/projects` - Fetch all projects (paginated)
-   `POST /api/projects` - Create a new project
-   `GET /api/projects/[id]` - Fetch project by ID (includes user and tasks)
-   `PUT /api/projects/[id]` - Update project by ID
-   `DELETE /api/projects/[id]` - Delete project by ID
-   `GET /api/tasks` - Fetch all tasks (paginated)
-   `POST /api/tasks` - Create a new task
-   `GET /api/tasks/[id]` - Fetch task by ID (includes project and assigned user)
-   `PUT /api/tasks/[id]` - Update task by ID
-   `DELETE /api/tasks/[id]` - Delete task by ID

### HTTP Verbs & Actions
| Verb | Action | Sample Route | Description |
| :--- | :--- | :--- | :--- |
| GET | REAd | `/api/users` | Get all users with pagination |
| POST | CREATE | `/api/users` | Create a new user |
| GET | READ | `/api/users/1` | Get specific user by ID |
| PUT | UPDATE | `/api/users/1` | Update user by ID |
| DELETE | DELETE | `/api/users/1` | Delete user by ID |

### Unified Response Envelope
Every endpoint in this API follows a common response format to ensure predictability and ease of handling for frontend developers.

**Success Response Format:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

### Error Codes
A dictionary of standardized error codes is maintained for consistency:

| Code | Label | Description |
| :--- | :--- | :--- |
| `E001` | `VALIDATION_ERROR` | Missing required fields or invalid input |
| `E002` | `NOT_FOUND` | Resource not found |
| `E003` | `DATABASE_FAILURE` | Issues related to database operations |
| `E500` | `INTERNAL_ERROR` | Unexpected server errors |

### Pagination & Response Semantics
-   **Pagination**: GET requests for collections support `page` and `limit` query parameters.
    -   Example: `/api/users?page=1&limit=10`
    -   The `data` object in the success response will contain both the collection and the metadata.
-   **Unified Handling**: Utilities in `lib/responseHandler.ts` are used to send responses consistently.
    -   `sendSuccess(data, message, status)`
    -   `sendError(message, code, status, details)`

### Sample Responses

**Success (GET /api/users):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "data": [
      { "id": 1, "name": "Alice", "email": "alice@example.com" },
      { "id": 2, "name": "Bob", "email": "bob@example.com" }
    ],
    "meta": {
      "total": 2,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2026-02-05T10:00:00.000Z"
}
```

**Error (Missing Field):**
```json
{
  "success": false,
  "message": "Missing required fields",
  "error": {
    "code": "E001",
    "details": null
  },
  "timestamp": "2026-02-05T10:00:00.000Z"
}
```

### Reflection: Developer Experience & Observability
By implementing a unified response envelope, we've achieved several key benefits:
1.  **Predictability**: Frontend developers no longer need to guess the shape of the data. All responses have the same top-level structure.
2.  **Simplified Frontend Logic**: Universal error handling can be implemented (e.g., in an Axios interceptor) to catch any response where `success: false`.
3.  **Better Debugging**: Every error response includes a specific error code and a timestamp, making it easier to trace issues in logs.
4.  **Consistency**: No matter who writes a new endpoint, it speaks the same "API voice," maintaining the integrity of the system's design.

## Input Validation with Zod

By integrating Zod into our Next.js API routes, we ensure that every endpoint trusts but verifies the data it receives. This builds safer and more reliable endpoints that fail gracefully and communicate clearly with the client.

### Key Benefits
- **Type Safety**: Automatic TypeScript inference from schemas.
- **Clear Errors**: Standardized, descriptive error messages for validation failures.
- **Consistency**: Shared schemas between client and server.
- **Improved UX**: Detailed field-level feedback for frontend forms.

### Schema Definitions
We use shared schemas located in `lib/schemas/`.

#### User Schema
```typescript
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
});
```

#### Project Schema
```typescript
export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters long"),
  description: z.string().optional().nullable(),
  userId: z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]),
});
```

#### Task Schema
```typescript
export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  projectId: z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]),
});
```

### Error Handling
Validation errors are caught and formatted using `formatZodError` in `lib/zodErrorHandler.ts`.

Example Error Response:
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "code": "E001",
    "details": [
      { "field": "email", "message": "Invalid email address" }
    ]
  },
  "timestamp": "2026-02-05T16:30:00.000Z"
}
```

### Reflection
Consistent validation logic ensures data integrity and reduces "schema drift." Standardized error envelopes improve the debugging experience and allow for universal error handling on the frontend.
