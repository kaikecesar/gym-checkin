// Libraries
import { hash } from 'bcryptjs';
import type { User } from '../generated/prisma/client.ts';

// Application
import type { IUsersRepository } from '../repositories/database/users.repository.types.ts';
import { UserAlreadyExistsError } from './errors.ts';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  user: User;
}

export class RegisterUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    // Validate
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    // Create password hash
    const passwordHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });

    return { user };
  }
}
