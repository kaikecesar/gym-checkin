// Libraries
import { faker } from '@faker-js/faker';
import type { CheckIn, Prisma } from '../../generated/prisma/client.ts';

// Application
import type { ICheckInsRepository } from '../repositories.types.ts';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public records: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkInOnSameDate = this.records.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) return null;

    return checkInOnSameDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: faker.string.uuid(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    };

    this.records.push(checkIn);

    return checkIn;
  }
}
