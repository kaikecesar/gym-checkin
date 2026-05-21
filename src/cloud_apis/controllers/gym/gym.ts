// Libraries
import z from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

// Application
import {
  factoryCreateGym,
  factoryFetchNearByGym,
  factorySearchGym,
} from '../../../services/factories.ts';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    lat: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    lng: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, description, phone, lat, lng } = createBodySchema.parse(
    request.body,
  );

  const createGym = factoryCreateGym();
  await createGym.execute({
    title,
    lat,
    lng,
    description,
    phone,
  });

  return reply.status(201).send({ message: 'Gym successfully created.' });
}

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchQuerySchema.parse(request.body);

  const searchGym = factorySearchGym();
  const { gyms } = await searchGym.execute({
    query,
    page,
  });

  return reply.status(200).send({ gyms });
}

export async function fetchNearBy(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchNearbyGymsQuerySchema = z.object({
    lat: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    lng: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { lat, lng } = fetchNearbyGymsQuerySchema.parse(request.params);

  const fetchNearByGyms = factoryFetchNearByGym();
  const gyms = await fetchNearByGyms.execute({
    userLat: lat,
    userLng: lng,
  });

  return reply.status(200).send({ gyms });
}
