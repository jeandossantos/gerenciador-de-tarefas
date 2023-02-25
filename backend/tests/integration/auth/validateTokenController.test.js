import * as dotenv from 'dotenv';
dotenv.config();

import { test, describe, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { connection as knex } from '../../../src/database/knex.mjs';

async function createUser({ name, email, initials, password }) {
  return await knex('users').insert({
    name,
    email,
    initials,
    password: Util.encryptPassword(password),
  });
}

describe('#Validate Token - Integration', () => {
  let existingUser = null;

  beforeAll(async () => {
    await knex('users').where('id', '>', 1).del();

    const { password, initials, confirmPassword } = UserObjectMother.valid();

    existingUser = {
      name: 'existing-user',
      initials,
      email: 'existing-user@example.com',
      password,
      confirmPassword,
    };

    const [userId] = await createUser(existingUser);

    existingUser.id = userId;
  });

  afterAll(async () => {
    return await knex('users').where({ id: existingUser.id }).del();
  });

  test('should returns false with invalid token', async () => {
    const invalidToken = 'bearer invalid token';

    const response = await request(app)
      .post('/validatetoken')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
    expect(response.body).toBe(false);
  });

  test('should returns false if user was not found', async () => {
    const { password } = UserObjectMother.valid();

    const nonexistentUser = {
      email: 'noneistent-user@example.com',
      password,
    };

    const validToken = jwt.sign(
      { id: nonexistentUser.id, email: nonexistentUser.email },
      process.env.SECRET_OR_KEY
    );

    const response = await request(app)
      .post('/validatetoken')
      .send({ token: validToken });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
    expect(response.body).toBe(false);
  });

  test('should returns true with valid token', async () => {
    const validToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.SECRET_OR_KEY
    );

    const response = await request(app)
      .post('/validatetoken')
      .send({ token: validToken });

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);
    expect(response.body).toBe(true);
  });
});
