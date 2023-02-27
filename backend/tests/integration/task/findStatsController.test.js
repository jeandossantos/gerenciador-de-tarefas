import { expect, describe, test, afterAll, beforeAll } from '@jest/globals';

import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return token;
}

const { user: existingUser } = await populateDatabase();

describe('#UpdateTaskController - Integration', () => {
  const VALID_TOKEN = `bearer ${tokenGenerator({
    id: existingUser.id,
    email: existingUser.email,
  })}`;

  test('should not find stats without authorization token', async () => {
    const response = await request(app).get('/stats');

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should find task stats', async () => {
    const response = await request(app)
      .get('/stats')
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);

    expect(response.body).toHaveProperty('expiredTasksCount');
    expect(response.body).toHaveProperty('totaltasksCount');
    expect(response.body).toHaveProperty('finishedTasksCount');
  });
});
