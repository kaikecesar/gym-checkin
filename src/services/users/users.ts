// Libraries
import { hash } from 'bcryptjs';
import type { User } from '../../generated/prisma/client.ts';

// Application
import type { IUsersRepository } from '../../repositories/database/users/types.ts';
import { ResourceNotFoundError, UserAlreadyExistsError } from '../errors.ts';
import type { ICheckInsRepository } from '../../repositories/repositories.types.ts';

// Register
interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  user: User;
}

// Profile
interface UserProfileRequest {
  userId: string;
}

interface UserProfileResponse {
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

export class UserProfile {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ userId }: UserProfileRequest): Promise<UserProfileResponse> {
    // Validate
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
