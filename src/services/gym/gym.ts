// Libraries
import { hash } from 'bcryptjs';
import type { Gym } from '../../generated/prisma/client.ts';

// Application
import { UserAlreadyExistsError } from '../errors.ts';
import type { IGymsRepository } from '../../repositories/repositories.types.ts';

// Register
interface CreateGymRequest {
  title: string;
  description: string | null;
  phone: string | null;
  lat: number;
  lng: number;
}

interface CreateGymResponse {
  gym: Gym;
}

export class CreateGym {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    title,
    description,
    phone,
    lat,
    lng,
  }: CreateGymRequest): Promise<CreateGymResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      lat,
      lng,
    });

    return { gym };
  }
}
