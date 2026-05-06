// Libraries
import { faker } from '@faker-js/faker';
import type { CheckIn, Prisma } from '../../../generated/prisma/client.ts';

// Application
import type { ICheckInsRepository } from '../../database/check_ins/types.ts';

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public records: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkInOnSameDate = this.records.find(
      (checkIn) => checkIn.user_id === userId,
    );

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
