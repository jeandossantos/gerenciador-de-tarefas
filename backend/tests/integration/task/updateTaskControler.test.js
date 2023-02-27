import { expect, describe, test, afterAll, beforeAll } from '@jest/globals';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { TaskObjectMother } from '../../model/task/taskObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return `bearer ${token}`;
}

const { user: EXISTING_USER, task: EXISTING_TASK } = await populateDatabase();

describe('#UpdateTaskController - Integration', () => {
  const VALID_TOKEN = tokenGenerator({
    id: EXISTING_USER.id,
    email: EXISTING_USER.email,
  });

  const request = supertest(app);

  test('should return 401 with invalid authentication token', async () => {
    const response = await request.put(`/tasks/${EXISTING_TASK.id}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not update a user with an invalid name', async () => {
    const task = TaskObjectMother.withInvalidName();

    const response = await request
      .put(`/tasks/${EXISTING_TASK.id}`)
      .send(task)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Nome invalido!');
  });

  test('should update a task', async () => {
    const task = TaskObjectMother.valid();

    const response = await request
      .put(`/tasks/${EXISTING_TASK.id}`)
      .send(task)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);
  });
});
