import { expect, describe, test, afterAll, beforeAll } from '@jest/globals';

import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';

import { NONEXISTENT_USER } from '../../mock/nonexistent-user.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return token;
}

const { user: EXISTING_USER } = await populateDatabase();

describe('#FindDailyTasksController - Integration', () => {
  const user = UserObjectMother.valid();
  EXISTING_USER.password = user.password;

  const VALID_TOKEN = `bearer ${tokenGenerator({
    id: EXISTING_USER.id,
    email: EXISTING_USER.email,
  })}`;

  const request = supertest(app);

  test('should not be able to find daily tasks without authorization token', async () => {
    const response = await request.get('/tasks/daily');

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not find daily tasks with invalid owner id', async () => {
    const VALID_TOKEN_WITH_NONEXISTENT_USER = jwt.sign(
      NONEXISTENT_USER,
      process.env.SECRET_OR_KEY
    );

    const response = await request
      .get('/tasks/daily')
      .set('Authorization', VALID_TOKEN_WITH_NONEXISTENT_USER);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should be return exactly 3 tasks', async () => {
    const response = await request
      .get('/tasks/daily')
      .set('Authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('count');
  });
});
