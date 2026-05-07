// Libraries
import { faker } from '@faker-js/faker';
import { Prisma, type Gym } from '../../generated/prisma/client.ts';

// Application
import type { IGymsRepository } from '../repositories.types.ts';

export class InMemoryGymsRepository implements IGymsRepository {
  public records: Gym[] = [];

  async findById(id: string) {
    const gym = this.records.find((record) => record.id === id);

    return gym ?? null;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? faker.string.uuid(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      lat: new Prisma.Decimal(String(data.lat)),
      lng: new Prisma.Decimal(String(data.lng)),
      checkIns: data.checkIns,
    };

    this.records.push(gym);

    return gym;
  }
}
