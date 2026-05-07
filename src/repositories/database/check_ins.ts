// Libraries
import type { CheckIn, Prisma } from '../../generated/prisma/client.ts';

// Application
import { prisma } from '../../lib/prisma.ts';
import type { ICheckInsRepository } from '../repositories.types.ts';

export class CheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data });

    return checkIn;
  }
}
