import { expect, describe, test, afterAll, beforeAll } from '@jest/globals';

import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { TaskObjectMother } from '../../model/task/taskObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';

import { clearDatabase, populateDatabase } from '../../TestService.mjs';

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return `$bearer ${token}`;
}

const { user: EXISTING_USER, task } = await populateDatabase();

describe('#UpdateTaskController - Integration', () => {
  const user = UserObjectMother.valid();
  EXISTING_USER.password = user.password;

  const VALID_TOKEN = tokenGenerator({
    id: EXISTING_USER.id,
    email: EXISTING_USER.email,
  });

  test('should not mark task as done without authorization token', async () => {
    const response = await request(app).post('/tasks/finish/' + task.id);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not mark task as done with invalid task id', async () => {
    const { id: invalidId } = TaskObjectMother.withInvalidId();

    const response = await request(app)
      .post('/tasks/finish/' + invalidId)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
  });

  test('should mark task as done with valid task id', async () => {
    const response = await request(app)
      .post('/tasks/finish/' + task.id)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);
  });
});
