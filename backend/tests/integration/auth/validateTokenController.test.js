import * as dotenv from 'dotenv';
dotenv.config();

import { test, describe, expect, beforeAll, afterAll } from '@jest/globals';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import supertest from 'supertest';

import { Util } from '../../../src/utils/util.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';
import { NONEXISTENT_USER } from '../../mock/nonexistent-user.mjs';

const { user: EXISTING_USER } = await populateDatabase();

describe('#Validate Token - Integration', () => {
  const user = UserObjectMother.valid();
  EXISTING_USER.password = user.password;

  const request = supertest(app);

  test('should returns false with invalid token', async () => {
    const invalidToken = 'bearer invalid token';

    const response = await request
      .post('/validatetoken')
      .set('Authorization', `bearer ${invalidToken}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);
    expect(response.body).toBe(false);
  });

  test('should returns false if user was not found', async () => {
    const VALID_TOKEN_WITH_NONEXISTENT_USER = jwt.sign(
      NONEXISTENT_USER,
      process.env.SECRET_OR_KEY
    );

    const response = await request
      .post('/validatetoken')
      .send({ token: VALID_TOKEN_WITH_NONEXISTENT_USER });

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);
    expect(response.body).toBe(false);
  });

  test('should returns true with valid token', async () => {
    const validToken = jwt.sign(
      { id: EXISTING_USER.id, email: EXISTING_USER.email },
      process.env.SECRET_OR_KEY
    );

    const response = await request
      .post('/validatetoken')
      .send({ token: validToken });

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);
    expect(response.body).toBe(true);
  });
});
