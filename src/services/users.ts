// Libraries
import { hash } from 'bcryptjs';

// Application
import { prisma } from '../lib/prisma.ts';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({
  name,
  email,
  password,
}: RegisterUserRequest) {
  // Create password hash
  const passwordHash = await hash(password, 6);

  // Validate
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.');
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  });
}
