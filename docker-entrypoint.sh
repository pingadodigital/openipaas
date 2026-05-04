#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "⏳ Waiting for database to be ready..."

# We use the DATABASE_URL to check connection
# Note: In alpine, we might not have pg_isready, so we try prisma db pull or similar as a check
until npx prisma db push --skip-generate; do
  echo "🟡 Database is not ready yet - sleeping..."
  sleep 2
done

echo "✅ Database is ready!"

echo "🌱 Running database seed..."
npx prisma db seed

echo "🚀 Starting Next.js application..."
node server.js
