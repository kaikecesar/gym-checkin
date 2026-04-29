// Libraries
import type { FastifyInstance } from 'fastify';

// Application
import { register } from './controllers/register.ts';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
}
