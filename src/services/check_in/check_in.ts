// Libraries
import type { CheckIn } from '../../generated/prisma/client.ts';

// Application
import {
  type ICheckInsRepository,
  type IGymsRepository,
} from '../../repositories/repositories.types.ts';
import { getDistanceBetweenCoodinates } from '../../utils/get_distance_between_coordinates.ts';
import { ResourceNotFound } from '../errors.ts';

interface RegisterCheckInRequest {
  userId: string;
  gymId: string;
  userLat: number;
  userLng: number;
}

interface RegisterCheckInResponse {
  checkIn: CheckIn;
}

export class RegisterCheckIn {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLat,
    userLng,
  }: RegisterCheckInRequest): Promise<RegisterCheckInResponse> {
    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) throw new ResourceNotFound();

    // Calculate distance between user and gym
    const distance = getDistanceBetweenCoodinates(
      { latitude: userLat, longitude: userLng },
      { latitude: gym.lat.toNumber(), longitude: gym.lng.toNumber() },
    );

    if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new Error();

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) throw new Error();

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
