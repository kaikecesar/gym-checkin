// Libraries
import type { Prisma, CheckIn } from '../../../generated/prisma/client.ts';

export interface ICheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
}
