// Libraries
import fastify from 'fastify';

// Application
import { appRoutes } from './cloud_apis/routes.ts';

export const app = fastify();

app.register(appRoutes);
