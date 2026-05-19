// Application
import { UsersRepository } from '../repositories/database/users.ts';
import { Auth } from './auth/auth.ts';
import { GetUserProfile, RegisterUser } from './users/users.ts';

export function factoryAuth() {
  const usersRepository = new UsersRepository();
  const useCase = new Auth(usersRepository);

  return useCase;
}

export function factoryRegisterUser() {
  const usersRepository = new UsersRepository();
  const useCase = new RegisterUser(usersRepository);

  return useCase;
}

export function factoryGetUserProfile() {
  const usersRepository = new UsersRepository();
  const useCase = new GetUserProfile(usersRepository);

  return useCase;
}
