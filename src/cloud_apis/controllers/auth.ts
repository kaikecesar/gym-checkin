// Libraries
import z from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

// Application
import { InvalidCredentialsError } from '../../services/errors.ts';
import { factoryAuth } from '../../services/factories.ts';

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authBodySchema.parse(request.body);

  try {
    const auth = factoryAuth();
    const { user } = await auth.execute({ email, password });

    const token = await reply.jwtSign({}, { sign: { sub: user.id } });

    return reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error; // TODO: fix me
  }
}
