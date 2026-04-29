// Libraries
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

// Application
import { env } from '../env/index.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
});

export { prisma };
