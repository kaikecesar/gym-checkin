// Application
import type { Gym } from '../../generated/prisma/client.ts';
import type { GymCreateInput } from '../../generated/prisma/models.ts';
import { prisma } from '../../lib/prisma.ts';
import type {
  FindManyNearByParams,
  IGymsRepository,
} from '../repositories.types.ts';

export class GymsRepository implements IGymsRepository {
  async findById(id: string): Promise<Gym | null> {
    return await prisma.gym.findUnique({ where: { id } });
  }

  async create(data: GymCreateInput): Promise<Gym> {
    return await prisma.gym.create({
      data,
    });
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const ITEMS_PER_PAGE = 20;

    return await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    });
  }

  async findManyNearBy({ lat, lng }: FindManyNearByParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(${lng}) ) + sin( radians(${lat}) ) * sin( radians( lat ) ) ) ) <= MAX_DISTANCE_IN_KILOMETERS
    `;

    return gyms;
  }
}
