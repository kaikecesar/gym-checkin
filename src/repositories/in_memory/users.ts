// Libraries
import { faker } from '@faker-js/faker';
import type { Prisma, User } from '../../generated/prisma/client.ts';

// Application
import type { IUsersRepository } from '../repositories.types.ts';

export class InMemoryUsersRepository implements IUsersRepository {
  public records: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: faker.string.uuid(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.records.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.records.find((record) => record.email === email);

    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.records.find((record) => record.id === id);

    return user ?? null;
  }
}
