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
