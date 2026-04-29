// Libraries
import { hash } from 'bcryptjs';

// Application
import { prisma } from '../lib/prisma.ts';
import type { IUsersRepository } from '../repositories/users.repository.types.ts';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: RegisterUserRequest) {
    // Validate
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('E-mail already exists.');
    }

    // Create password hash
    const passwordHash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });
  }
}
