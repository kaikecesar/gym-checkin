// Libraries
import type { Gym } from '../../generated/prisma/client.ts';

// Application
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

// Search
interface SearchGymRequest {
  query: string;
  page: number;
}

interface SearchGymResponse {
  gyms: Gym[];
}

// Near By
interface FetchNearByGymsRequest {
  userLat: number;
  userLng: number;
}

interface FetchNearByGymsResponse {
  gyms: Gym[];
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

export class SearchGym {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({ query, page }: SearchGymRequest): Promise<SearchGymResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}

export class FetchNearByGyms {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    userLat,
    userLng,
  }: FetchNearByGymsRequest): Promise<FetchNearByGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearBy({
      lat: userLat,
      lng: userLng,
    });

    return { gyms };
  }
}
