// Libraries
import { faker } from '@faker-js/faker';
import type { Gym, Prisma } from '../../generated/prisma/client.ts';

// Application
import type { IGymsRepository } from '../repositories.types.ts';
import { Decimal } from '@prisma/client/runtime/client';

export class InMemoryGymsRepository implements IGymsRepository {
  public records: Gym[] = [];

  async findById(id: string) {
    const gym = this.records.find((record) => record.id === id);

    return gym ?? null;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: faker.string.uuid(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      lat: new Decimal(String(data.lat)),
      lng: new Decimal(String(data.lng)),
      checkIns: data.checkIns,
    };

    this.records.push(gym);

    return gym;
  }
}
