// Libraries
import z from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

// Application
import { UserAlreadyExistsError } from '../../services/errors.ts';
import { factoryRegisterUser } from '../../services/factories.ts';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUser = factoryRegisterUser();
    await registerUser.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error; // TODO: fix me
  }

  return reply.status(201).send();
}

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();

  return reply.status(200).send();
}
