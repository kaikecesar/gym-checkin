// Libraries
import type { Prisma } from '../generated/prisma/client.ts';

// Application
import { prisma } from '../lib/prisma.ts';

export class UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data });

    return user;
  }
}
