// Libraries
import { expect, it, describe, beforeEach } from 'vitest';
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
    });

    it('should be able to check in', async () => {
      const { checkIn } = await registerCheckIn.execute({
        gymId: faker.string.uuid(),
        userId: faker.string.uuid(),
      });

      expect(checkIn.id).toEqual(expect.any(String));
    });
  });
});
