// Libraries
import { hash } from 'bcryptjs';

// Application
import { prisma } from '../lib/prisma.ts';
import { UsersRepository } from '../repositories/users.repository.ts';

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

  const usersRepository = new UsersRepository();

  await usersRepository.create({
    name,
    email,
    password_hash: passwordHash,
  });
}
