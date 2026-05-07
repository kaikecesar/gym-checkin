// Libraries
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { InMemoryCheckInsRepository } from '../../repositories/in_memory/check_ins.ts';
import {
  FetchUserCheckInsHistory,
  GetUserMetrics,
  RegisterCheckIn,
  ValidateCheckIn,
} from './check_in.ts';
import { InMemoryGymsRepository } from '../../repositories/in_memory/gyms.ts';
import type { Gym } from '../../generated/prisma/client.ts';
import {
  MaxDistanceError,
  MaxNumberOfCheckInsError,
  ResourceNotFoundError,
} from '../errors.ts';

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

  describe('history', () => {
    let checkInRepository: InMemoryCheckInsRepository;
    let fetchUserCheckInsHistory: FetchUserCheckInsHistory;

    beforeEach(async () => {
      checkInRepository = new InMemoryCheckInsRepository();
      fetchUserCheckInsHistory = new FetchUserCheckInsHistory(
        checkInRepository,
      );
    });

    it('should be able to fetch check-in history', async () => {
      const fakeUserId = faker.string.uuid();
      const fakeCheckIn1 = await checkInRepository.create({
        gym_id: faker.string.uuid(),
        user_id: fakeUserId,
      });

      const fakeCheckIn2 = await checkInRepository.create({
        gym_id: faker.string.uuid(),
        user_id: fakeUserId,
      });

      const { checkIns } = await fetchUserCheckInsHistory.execute({
        userId: fakeUserId,
        page: 1,
      });

      expect(checkIns).toHaveLength(2);
      expect(checkIns).toEqual([fakeCheckIn1, fakeCheckIn2]);
    });

    it('should be able to fetch paginated check-in history', async () => {
      for (let i = 1; i <= 22; i++) {
        await checkInRepository.create({
          gym_id: `gym-${i}`,
          user_id: 'user-01',
        });
      }

      const { checkIns } = await fetchUserCheckInsHistory.execute({
        userId: 'user-01',
        page: 2,
      });

      expect(checkIns).toHaveLength(2);
      expect(checkIns).toEqual([
        expect.objectContaining({ gym_id: 'gym-21' }),
        expect.objectContaining({ gym_id: 'gym-22' }),
      ]);
    });
  });

  describe('metrics', () => {
    let checkInRepository: InMemoryCheckInsRepository;
    let getUserMetrics: GetUserMetrics;

    beforeEach(async () => {
      checkInRepository = new InMemoryCheckInsRepository();
      getUserMetrics = new GetUserMetrics(checkInRepository);
    });

    it('should be able to fetch check-in history', async () => {
      const fakeUserId = faker.string.uuid();
      await checkInRepository.create({
        gym_id: faker.string.uuid(),
        user_id: fakeUserId,
      });

      await checkInRepository.create({
        gym_id: faker.string.uuid(),
        user_id: fakeUserId,
      });

      const { checkInsCount } = await getUserMetrics.execute({
        userId: fakeUserId,
      });

      expect(checkInsCount).toEqual(2);
    });
  });

  describe('validate', () => {
    let checkInRepository: InMemoryCheckInsRepository;
    let validateCheckIn: ValidateCheckIn;

    beforeEach(async () => {
      checkInRepository = new InMemoryCheckInsRepository();
      validateCheckIn = new ValidateCheckIn(checkInRepository);
    });

    it('should be able to validate the check-in', async () => {
      const createdCheckIn = await checkInRepository.create({
        gym_id: faker.string.uuid(),
        user_id: faker.string.uuid(),
      });

      const { checkIn } = await validateCheckIn.execute({
        checkInId: createdCheckIn.id,
      });

      expect(checkIn.validated_at).toEqual(expect.any(Date));
      expect(checkInRepository.records[0]?.validated_at).toEqual(
        expect.any(Date),
      );
    });

    it('should not be able to validate an inexistent check-in', async () => {
      await expect(() =>
        validateCheckIn.execute({
          checkInId: faker.string.uuid(),
        }),
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
  });
});
