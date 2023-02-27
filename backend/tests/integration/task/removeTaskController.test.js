import { expect, describe, test, afterAll, beforeAll } from '@jest/globals';

import jwt from 'jsonwebtoken';
import supertest from 'supertest';

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

  test('should not remove a task without authorization token', async () => {
    const response = await request.del('/tasks/' + EXISTING_TASK.id);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not remove a task with invalid task ID', async () => {
    const { id: invalidTaskId } = TaskObjectMother.withInvalidId();

    const response = await request
      .del('/tasks/' + invalidTaskId)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Formato do ID invalido!');
  });

  test('should remove a task with valid task ID', async () => {
    const response = await request
      .del(`/tasks/${EXISTING_TASK.id}`)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);
  });
});
