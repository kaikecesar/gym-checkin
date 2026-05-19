// Libraries
import type { FastifyInstance } from 'fastify';

// Application
import { profile, register } from './controllers/user.ts';
import { auth } from './controllers/auth.ts';
import { verifyJWT } from '../middlewares/verify_jwt.ts';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', auth);

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profile);
}
