// Libraries
import dayjs from 'dayjs';
import type { CheckIn, Prisma } from '../../generated/prisma/client.ts';

// Application
import { prisma } from '../../lib/prisma.ts';
import type { ICheckInsRepository } from '../repositories.types.ts';

export class CheckInsRepository implements ICheckInsRepository {
  async findById(id: string): Promise<CheckIn | null> {
    return await prisma.checkIn.findUnique({
      where: { id },
    });
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const updatedCheckIn = await prisma.checkIn.update({
      where: { id: checkIn.id },
      data: checkIn,
    });

    return updatedCheckIn;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const ITEMS_PER_PAGE = 20;

    return await prisma.checkIn.findMany({
      where: { user_id: userId },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return await prisma.checkIn.count({
      where: { user_id: userId },
    });
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    return await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: { gte: startOfTheDay.toDate(), lte: endOfTheDay.toDate() },
      },
    });
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data });

    return checkIn;
  }
}
