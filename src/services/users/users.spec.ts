// Libraries
import { compare } from 'bcryptjs';
import { expect, it, describe } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { RegisterUser } from './users.ts';
import { InMemoryUsersRepository } from '../../repositories/in_memory/in_memory_users_repository.ts';
import { UserAlreadyExistsError } from '../errors.ts';

describe('Users service', () => {
  describe('register', () => {
    it('should be able to register', async () => {
      const usersRepository = new InMemoryUsersRepository();
      const registerUser = new RegisterUser(usersRepository);

      const fakePassword = faker.internet.password();

      const { user } = await registerUser.execute({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: fakePassword,
      });

      expect(user.id).toEqual(expect.any(String));
    });

    it('should hash user password upon registration', async () => {
      const usersRepository = new InMemoryUsersRepository();
      const registerUser = new RegisterUser(usersRepository);

      const fakePassword = faker.internet.password();

      const { user } = await registerUser.execute({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: fakePassword,
      });

      const isPasswordCorrectlyHashed = await compare(
        fakePassword,
        user.password_hash,
      );

      expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it('should not be able to register with same email twice', async () => {
      const usersRepository = new InMemoryUsersRepository();
      const registerUser = new RegisterUser(usersRepository);

      const fakePassword = faker.internet.password();
      const fakeEmail = faker.internet.email();

      await registerUser.execute({
        name: faker.person.fullName(),
        email: fakeEmail,
        password: fakePassword,
      });

      await expect(() =>
        registerUser.execute({
          name: faker.person.fullName(),
          email: fakeEmail,
          password: fakePassword,
        }),
      ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
  });
});
