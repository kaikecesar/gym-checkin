// Libraries
import z from 'zod';
import { hash } from 'bcryptjs';
import type { FastifyReply, FastifyRequest } from 'fastify';

// Application
import { prisma } from '../../lib/prisma.ts';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  // Create password hash
  const passwordHash = await hash(password, 6);

  // Validate
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    return reply.status(409).send();
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  });

  return reply.status(201).send();
}
