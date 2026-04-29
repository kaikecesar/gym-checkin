// Libraries
import { hash } from 'bcryptjs';
import { expect, it, describe } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { InMemoryUsersRepository } from '../../repositories/in_memory/in_memory_users_repository.ts';
import { Auth } from './auth.ts';
import { InvalidCredentialsError } from '../errors.ts';

describe('Auth service', () => {
  describe('auth', () => {
    it('should be able to authenticate', async () => {
      const usersRepository = new InMemoryUsersRepository();
      const authenticate = new Auth(usersRepository);

      // Mock users
      const fakePassword = faker.internet.password();
      const fakeEmail = faker.internet.email();
      await usersRepository.create({
        name: faker.internet.username(),
        email: fakeEmail,
        password_hash: await hash(fakePassword, 6),
      });

      const { user } = await authenticate.execute({
        email: fakeEmail,
        password: fakePassword,
      });

      expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with wrong email', async () => {
      const usersRepository = new InMemoryUsersRepository();
      const authenticate = new Auth(usersRepository);

      expect(() =>
        authenticate.execute({
          email: faker.internet.email(),
          password: faker.internet.password(),
        }),
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () => {
      const usersRepository = new InMemoryUsersRepository();
      const authenticate = new Auth(usersRepository);

      // Mock users
      const fakeEmail = faker.internet.email();
      await usersRepository.create({
        name: faker.internet.username(),
        email: fakeEmail,
        password_hash: await hash(faker.internet.password(), 6),
      });

      expect(() =>
        authenticate.execute({
          email: fakeEmail,
          password: faker.internet.password(),
        }),
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
  });
});
