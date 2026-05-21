// Libraries
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Application
import { app } from '../../../app.ts';
import { faker } from '@faker-js/faker';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it('should be able to autenticate an user', async () => {
    const fakeUserEmail = faker.internet.email();
    const fakeUserPassword = faker.internet.password();
    await request(app.server).post('/users').send({
      name: faker.internet.username(),
      email: fakeUserEmail,
      password: fakeUserPassword,
    });

    const response = await request(app.server).post('/sessions').send({
      email: fakeUserEmail,
      password: fakeUserPassword,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
