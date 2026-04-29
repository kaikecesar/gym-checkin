// Libraries
import { hash } from 'bcryptjs';

// Application
import type { IUsersRepository } from '../repositories/users.repository.types.ts';
import { UserAlreadyExistsError } from './errors.ts';

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
      throw new UserAlreadyExistsError();
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
