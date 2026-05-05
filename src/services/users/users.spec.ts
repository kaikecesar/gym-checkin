// Libraries
import { compare } from 'bcryptjs';
import { expect, it, describe, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { RegisterUser } from './users.ts';
import { InMemoryUsersRepository } from '../../repositories/in_memory/in_memory_users_repository.ts';
import { UserAlreadyExistsError } from '../errors.ts';

describe('Users service', () => {
  describe('register', () => {
    let usersRepository: InMemoryUsersRepository;
    let registerUser: RegisterUser;

    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      registerUser = new RegisterUser(usersRepository);
    });

    it('should be able to register', async () => {
      const fakePassword = faker.internet.password();

      const { user } = await registerUser.execute({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: fakePassword,
      });

      expect(user.id).toEqual(expect.any(String));
    });

    it('should hash user password upon registration', async () => {
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
