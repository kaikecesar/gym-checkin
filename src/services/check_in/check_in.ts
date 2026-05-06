// Libraries
import type { CheckIn } from '../../generated/prisma/client.ts';

// Application
import { CheckInsRepository } from '../../repositories/database/check_ins/index.ts';

interface RegisterCheckInRequest {
  userId: string;
  gymId: string;
}

interface RegisterCheckInResponse {
  checkIn: CheckIn;
}

export class RegisterCheckIn {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: RegisterCheckInRequest): Promise<RegisterCheckInResponse> {
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
