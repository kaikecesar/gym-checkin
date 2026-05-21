// Core
import { randomUUID } from 'node:crypto';

// Libraries
import 'dotenv/config';
import { execSync } from 'node:child_process';
import type { Environment } from 'vitest/environments';

// Application
import { prisma } from '../../src/lib/prisma.ts';

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL)
    throw new Error('Please provide a DATABASE_URL env variable');

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // Create test database
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma migrate deploy');

    return {
      // Delete test database
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );

        await prisma.$disconnect();
      },
    };
  },
};
