// Libraries
import { hash } from 'bcryptjs';
import { expect, it, describe, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { InMemoryUsersRepository } from '../../repositories/in_memory/users.ts';
import { Auth } from './auth.ts';
import { InvalidCredentialsError } from '../errors.ts';

let usersRepository: InMemoryUsersRepository;
let authenticate: Auth;

describe('Auth service', () => {
  describe('auth', () => {
    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      authenticate = new Auth(usersRepository);
    });
    it('should be able to authenticate', async () => {
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
      await expect(() =>
        authenticate.execute({
          email: faker.internet.email(),
          password: faker.internet.password(),
        }),
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () => {
      // Mock users
      const fakeEmail = faker.internet.email();
      await usersRepository.create({
        name: faker.internet.username(),
        email: fakeEmail,
        password_hash: await hash(faker.internet.password(), 6),
      });

      await expect(() =>
        authenticate.execute({
          email: fakeEmail,
          password: faker.internet.password(),
        }),
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
  });
});
