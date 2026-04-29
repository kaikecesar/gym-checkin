// Libraries
import type { Prisma, User } from '../../generated/prisma/client.ts';

// Application
import { prisma } from '../../lib/prisma.ts';
import type { IUsersRepository } from './users.repository.types.ts';

export class UsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({ data });

    return user;
  }
}
