// Libraries
import { expect, it, describe, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { CreateGym } from './gym.ts';
import { InMemoryGymsRepository } from '../../repositories/in_memory/gyms.ts';

describe('Gym service', () => {
  describe('create', () => {
    let gymsRepository: InMemoryGymsRepository;
    let createGym: CreateGym;

    beforeEach(() => {
      gymsRepository = new InMemoryGymsRepository();
      createGym = new CreateGym(gymsRepository);
    });

    it('should be able to create gym', async () => {
      const { gym } = await createGym.execute({
        title: faker.company.name(),
        description: null,
        phone: faker.phone.number(),
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      });

      expect(gym.id).toEqual(expect.any(String));
    });
  });
});
