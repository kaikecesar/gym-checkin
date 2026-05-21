// Application
import { GymsRepository } from '../repositories/database/gyms.ts';
import { UsersRepository } from '../repositories/database/users.ts';
import { Auth } from './auth/auth.ts';
import { CreateGym, FetchNearByGyms, SearchGym } from './gym/gym.ts';
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

export function factoryCreateGym() {
  const gymsRepository = new GymsRepository();
  const useCase = new CreateGym(gymsRepository);

  return useCase;
}

export function factorySearchGym() {
  const gymsRepository = new GymsRepository();
  const useCase = new SearchGym(gymsRepository);

  return useCase;
}

export function factoryFetchNearByGym() {
  const gymsRepository = new GymsRepository();
  const useCase = new FetchNearByGyms(gymsRepository);

  return useCase;
}
