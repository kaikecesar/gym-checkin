// Libraries
import type { FastifyInstance } from 'fastify';

// Application
import { register } from './controllers/register.ts';
import { auth } from './controllers/auth.ts';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);

  app.post('/sessions', auth);
}
