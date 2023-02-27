import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';

import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return `bearer ${token}`;
}

const { user: EXISTING_USER } = await populateDatabase();

describe('#FindTasksController - Integration', () => {
  const user = UserObjectMother.valid();
  EXISTING_USER.password = user.password;

  const VALID_TOKEN = tokenGenerator({
    id: EXISTING_USER.id,
    email: EXISTING_USER.email,
  });

  const request = supertest(app);

  test('should not be able to find tasks without authorization token', async () => {
    const response = await request.get('/tasks');

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not find tasks with invalid owner id', async () => {
    const response = await request
      .get('/tasks')
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('count');
  });

  test('should find task stats', async () => {
    const response = await request
      .get('/stats')
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);

    expect(response.body).toHaveProperty('expiredTasksCount');
    expect(response.body).toHaveProperty('totaltasksCount');
    expect(response.body).toHaveProperty('finishedTasksCount');
  });
});
