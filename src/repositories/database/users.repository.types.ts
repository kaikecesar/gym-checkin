// Libraries
import type { Prisma, User } from '../../generated/prisma/client.ts';

export interface IUsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
