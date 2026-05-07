// Libraries
import { expect, it, describe, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

// Application
import { CreateGym, FetchNearByGyms, SearchGym } from './gym.ts';
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

  describe('search', () => {
    let gymsRepository: InMemoryGymsRepository;
    let searchGym: SearchGym;

    beforeEach(() => {
      gymsRepository = new InMemoryGymsRepository();
      searchGym = new SearchGym(gymsRepository);
    });

    it('should be able to search for gyms', async () => {
      const fakeGymTitle = faker.company.name();

      await gymsRepository.create({
        title: fakeGymTitle,
        description: null,
        phone: faker.phone.number(),
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      });
      await gymsRepository.create({
        title: faker.company.name(),
        description: null,
        phone: faker.phone.number(),
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      });

      const { gyms } = await searchGym.execute({
        query: fakeGymTitle,
        page: 1,
      });

      expect(gyms).toHaveLength(1);
      expect(gyms).toEqual([expect.objectContaining({ title: fakeGymTitle })]);
    });

    it('should be able to fetch paginated gyms search', async () => {
      const fakeGymTitle = faker.company.name();

      for (let i = 1; i <= 22; i++) {
        await gymsRepository.create({
          title: fakeGymTitle + i,
          description: null,
          phone: faker.phone.number(),
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        });
      }

      const { gyms } = await searchGym.execute({
        query: fakeGymTitle,
        page: 2,
      });

      expect(gyms).toHaveLength(2);
      expect(gyms).toEqual([
        expect.objectContaining({ title: fakeGymTitle + 21 }),
        expect.objectContaining({ title: fakeGymTitle + 22 }),
      ]);
    });
  });

  describe('fetch nearby gyms', () => {
    let gymsRepository: InMemoryGymsRepository;
    let fetchNearByGyms: FetchNearByGyms;

    beforeEach(() => {
      gymsRepository = new InMemoryGymsRepository();
      fetchNearByGyms = new FetchNearByGyms(gymsRepository);
    });

    it('should be able to fetch nearby gyms', async () => {
      await gymsRepository.create({
        title: faker.company.name(),
        description: null,
        phone: faker.phone.number(),
        lat: -22.9492943,
        lng: -47.1593028,
      });
      const nearGym = await gymsRepository.create({
        title: faker.company.name(),
        description: null,
        phone: faker.phone.number(),
        lat: -23.0132546,
        lng: -47.5177239,
      });

      const { gyms } = await fetchNearByGyms.execute({
        userLat: nearGym.lat.toNumber(),
        userLng: nearGym.lng.toNumber(),
      });

      expect(gyms).toHaveLength(1);
      expect(gyms).toEqual([expect.objectContaining({ title: nearGym.title })]);
    });
  });
});
