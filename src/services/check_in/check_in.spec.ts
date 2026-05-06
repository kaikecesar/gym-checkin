// Libraries
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { InMemoryCheckInsRepository } from '../../repositories/in_memory/check_ins/check_ins.ts';
import { RegisterCheckIn } from './check_in.ts';

describe('Check In service', () => {
  describe('register', () => {
    let checkInRepository: InMemoryCheckInsRepository;
    let registerCheckIn: RegisterCheckIn;

    beforeEach(() => {
      checkInRepository = new InMemoryCheckInsRepository();
      registerCheckIn = new RegisterCheckIn(checkInRepository);

      vi.useFakeTimers();
    });

    afterEach(() => vi.useRealTimers());

    it('should be able to check in', async () => {
      const { checkIn } = await registerCheckIn.execute({
        gymId: faker.string.uuid(),
        userId: faker.string.uuid(),
      });

      expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice on the same day', async () => {
      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
      const fakeUserId = faker.string.uuid();

      await registerCheckIn.execute({
        gymId: faker.string.uuid(),
        userId: fakeUserId,
      });

      await expect(() =>
        registerCheckIn.execute({
          gymId: faker.string.uuid(),
          userId: fakeUserId,
        }),
      ).rejects.toBeInstanceOf(Error);
    });

    it('should be able to check in twice but in diferent days', async () => {
      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
      const fakeUserId = faker.string.uuid();

      await registerCheckIn.execute({
        gymId: faker.string.uuid(),
        userId: fakeUserId,
      });

      vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

      const { checkIn } = await registerCheckIn.execute({
        gymId: faker.string.uuid(),
        userId: fakeUserId,
      });

      expect(checkIn.id).toEqual(expect.any(String));
    });
  });
});
