# iPaaS - Unified API Gateway

A standardized, multi-ERP Unified API gateway built with Next.js, Prisma, and Zod.

## Quick Start (Full Docker Setup)

The entire project is containerized. To get everything running (Next.js, PostgreSQL, Migrations, and Seed Data) with a single command, just run:

```bash
docker-compose up --build
```

This command will:
1. Build the Next.js production image (standalone mode).
2. Start the PostgreSQL database.
3. Wait for the DB, then automatically run migrations and seeds.
4. Expose the API on `http://localhost:3000`.

## Test Credentials (Seed)

- **Master API Key**: `dev-master-key-001` (Use as Bearer token)
- **Conta Azul X-Account-Token**: `dev-token-ca-123`
- **Omie X-Account-Token**: `dev-token-omie-123`

## Architecture

- **Plugin-Based**: Each ERP has its own provider implementation.
- **English-First**: All endpoints return standardized English field names.
- **Zod Defense**: Mandatory validation layer for all outgoing data.
- **Remote Data**: Original raw payloads preserved in the `remoteData` node.
