// Libraries
import { hash } from 'bcryptjs';

// Application
import { prisma } from '../lib/prisma.ts';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterUserRequest) {
    // Create password hash
    const passwordHash = await hash(password, 6);

    // Validate
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new Error('E-mail already exists.');
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });
  }
}
