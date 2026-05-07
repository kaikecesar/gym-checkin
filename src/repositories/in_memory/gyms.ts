// Libraries
import { faker } from '@faker-js/faker';
import { Prisma, type Gym } from '../../generated/prisma/client.ts';

// Application
import type {
  FindManyNearByParams,
  IGymsRepository,
} from '../repositories.types.ts';
import { getDistanceBetweenCoodinates } from '../../utils/get_distance_between_coordinates.ts';

export class InMemoryGymsRepository implements IGymsRepository {
  public records: Gym[] = [];

  async findManyNearBy(params: FindManyNearByParams): Promise<Gym[]> {
    return this.records.filter((record) => {
      const distance = getDistanceBetweenCoodinates(
        { latitude: params.lat, longitude: params.lng },
        { latitude: record.lat.toNumber(), longitude: record.lng.toNumber() },
      );

      return distance < 10;
    });
  }

  async searchMany(query: string, page: number) {
    return this.records
      .filter((record) => record.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

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
