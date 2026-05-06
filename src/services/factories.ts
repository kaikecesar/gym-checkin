// Application
import { UsersRepository } from '../repositories/database/users.repository.ts';
import { Auth } from './auth/auth.ts';
import { RegisterUser } from './users/users.ts';

export function factoryAuth() {
  const usersRepository = new UsersRepository();
  const auth = new Auth(usersRepository);

  return auth;
}

export function factoryRegisterUser() {
  const usersRepository = new UsersRepository();
  const registerUser = new RegisterUser(usersRepository);

  return registerUser;
}
