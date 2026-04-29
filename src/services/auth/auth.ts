// Libraries
import type { User } from '../../generated/prisma/client.ts';
import { compare } from 'bcryptjs';

// Application
import type { UsersRepository } from '../../repositories/database/users.repository.ts';
import { InvalidCredentialsError } from '../errors.ts';

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
}

export class Auth {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: AuthRequest): Promise<AuthResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
