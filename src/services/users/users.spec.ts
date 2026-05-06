// Libraries
import { compare, hash } from 'bcryptjs';
import { expect, it, describe, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { RegisterUser, UserProfile } from './users.ts';
import { InMemoryUsersRepository } from '../../repositories/in_memory/users/users_repository.ts';
import { ResourceNotFound, UserAlreadyExistsError } from '../errors.ts';

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

  describe('userProfile', () => {
    let usersRepository: InMemoryUsersRepository;
    let userProfile: UserProfile;

    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      userProfile = new UserProfile(usersRepository);
    });
    it('should be able to get user profile', async () => {
      // Mock users
      const fakePassword = faker.internet.password();
      const createUser = await usersRepository.create({
        name: faker.internet.username(),
        email: faker.internet.email(),
        password_hash: await hash(fakePassword, 6),
        id: faker.string.uuid(),
      });

      const { user } = await userProfile.execute({
        userId: createUser.id,
      });

      expect(user.id).toEqual(expect.any(String));
      expect(user).toEqual(createUser);
    });

    it('should not be able to get user profile with wrong id', async () => {
      expect(() =>
        userProfile.execute({
          userId: 'non-existing-id',
        }),
      ).rejects.toBeInstanceOf(ResourceNotFound);
    });
  });
});
