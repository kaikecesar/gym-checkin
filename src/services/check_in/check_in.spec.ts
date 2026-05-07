// Libraries
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { InMemoryCheckInsRepository } from '../../repositories/in_memory/check_ins.ts';
import { RegisterCheckIn } from './check_in.ts';
import { InMemoryGymsRepository } from '../../repositories/in_memory/gyms.ts';
import type { Gym } from '../../generated/prisma/client.ts';
import { MaxDistanceError, MaxNumberOfCheckInsError } from '../errors.ts';

describe('Check In service', () => {
  describe('register', () => {
    let checkInRepository: InMemoryCheckInsRepository;
    let gymsRepository: InMemoryGymsRepository;
    let registerCheckIn: RegisterCheckIn;
    let gym: Gym;

    beforeEach(async () => {
      checkInRepository = new InMemoryCheckInsRepository();
      gymsRepository = new InMemoryGymsRepository();
      registerCheckIn = new RegisterCheckIn(checkInRepository, gymsRepository);

      gym = await gymsRepository.create({
        title: faker.company.name(),
        lat: -23.0132546,
        lng: -47.5177239,
        phone: faker.phone.number(),
      });

      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should be able to check in', async () => {
      const { checkIn } = await registerCheckIn.execute({
        gymId: gym.id,
        userId: faker.string.uuid(),
        userLat: -23.0132546,
        userLng: -47.5177239,
      });

      expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice on the same day', async () => {
      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
      const fakeUserId = faker.string.uuid();

      await registerCheckIn.execute({
        gymId: gym.id,
        userId: fakeUserId,
        userLat: -23.0132546,
        userLng: -47.5177239,
      });

      await expect(() =>
        registerCheckIn.execute({
          gymId: gym.id,
          userId: fakeUserId,
          userLat: -23.0132546,
          userLng: -47.5177239,
        }),
      ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
    });

    it('should be able to check in twice but in diferent days', async () => {
      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
      const fakeUserId = faker.string.uuid();

      await registerCheckIn.execute({
        gymId: gym.id,
        userId: fakeUserId,
        userLat: -23.0132546,
        userLng: -47.5177239,
      });

      vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

      const { checkIn } = await registerCheckIn.execute({
        gymId: gym.id,
        userId: fakeUserId,
        userLat: -23.0132546,
        userLng: -47.5177239,
      });

      expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in on distant gym', async () => {
      const distantGym = await gymsRepository.create({
        title: faker.company.name(),
        lat: -23.0132546,
        lng: -47.5177239,
        phone: faker.phone.number(),
      });

      await expect(() =>
        registerCheckIn.execute({
          gymId: distantGym.id,
          userId: faker.string.uuid(),
          userLat: 0,
          userLng: 0,
        }),
      ).rejects.toBeInstanceOf(MaxDistanceError);
    });
  });
});
