# Docker Setup Instructions

This project is containerized using Docker to ensure a consistent development environment.

## 1. Prerequisites

- Docker Desktop installed and running.

## 2. Dockerfile Overview

The `frontend/Dockerfile` defines the environment for the Next.js application:
- **Base Image**: `node:20-alpine` (lightweight and current).
- **Dependencies**: Copies `package.json` and runs `npm install`.
- **Build**: Copies source code and runs `npm run build`.
- **Runtime**: Exposes port 3000 and starts the app with `npm run start`.

## 3. Docker Compose Overview

The `docker-compose.yml` file orchestrates three services:
1.  **app**: The Next.js frontend (builds from `./frontend`).
    -   Connects to Postgres via `DATABASE_URL`.
    -   Connects to Redis via `REDIS_URL`.
    -   Ports: Maps container 3000 to host 3000.
2.  **db**: Postgres 15 database.
    -   Persists data in `db_data` volume.
    -   Ports: Maps 5432 to 5432.
3.  **redis**: Redis 7 cache.
    -   Ports: Maps 6379 to 6379.

All services share a custom bridge network `localnet`.

## 4. How to Run

1.  Open a terminal in the project root.
2.  Run the following command to build and start the services:

    ```bash
    docker-compose up --build
    ```

3.  Verify the application is running:
    -   **App**: [http://localhost:3000](http://localhost:3000)
    -   **Postgres**: Port `5432`
    -   **Redis**: Port `6379`

4.  To stop the services, press `Ctrl+C` or run:

    ```bash
    docker-compose down
    ```

## 5. Reflection

**Process & Challenges:**
-   **Structure**: The project structure required the exact build context to be set correctly in `docker-compose.yml` (`context: ./frontend` or just `build: ./frontend`) since the `Dockerfile` resides in the subfolder while `docker-compose.yml` is at the root.
-   **Networking**: Added a `localnet` network to ensure all containers can communicate using their service names (`db`, `redis`) as hostnames.
-   **Environment Variables**: Configured `DATABASE_URL` and `REDIS_URL` in the compose file to match the service names/credentials.

**Resolution:**
-   Standardized on `node:20-alpine` for the application to balance size and performance.
-   Used `volumes` for Postgres to ensure data persistence across restarts.
