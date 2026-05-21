// Libraries
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Application
import { app } from '../../../app.ts';
import { faker } from '@faker-js/faker';

beforeAll(async () => await app.ready());
afterAll(async () => await app.close());

describe('Register (e2e)', () => {
  it('should be able to register an user', async () => {
    const response = await request(app.server).post('/users').send({
      name: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(response.statusCode).toEqual(201);
  });
});

describe('Profile (e2e)', () => {
  it('should be able to get user profile', async () => {
    const fakeUserEmail = faker.internet.email();
    const fakeUserPassword = faker.internet.password();
    await request(app.server).post('/users').send({
      name: faker.internet.username(),
      email: fakeUserEmail,
      password: fakeUserPassword,
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email: fakeUserEmail,
      password: fakeUserPassword,
    });

    const { token } = authResponse.body;

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: fakeUserEmail,
      }),
    );
  });
});
