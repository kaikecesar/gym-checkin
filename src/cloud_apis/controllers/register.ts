// Libraries
import z from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

// Application
import { RegisterUser } from '../../services/users.ts';
import { UsersRepository } from '../../repositories/database/users.repository.ts';
import { UserAlreadyExistsError } from '../../services/errors.ts';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new UsersRepository();
    const registerUser = new RegisterUser(usersRepository);
    await registerUser.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error; // TODO: fix me
  }

  return reply.status(201).send();
}
