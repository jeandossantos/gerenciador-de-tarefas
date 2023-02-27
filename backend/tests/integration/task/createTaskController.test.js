import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { TaskObjectMother } from '../../model/task/taskObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return `bearer ${token}`;
}

const { user: EXISTING_USER } = await populateDatabase();

describe('#CreateTaskController - Integration', () => {
  const user = UserObjectMother.valid();
  EXISTING_USER.password = user.password;

  const VALID_TOKEN = tokenGenerator({
    id: EXISTING_USER.id,
    email: EXISTING_USER.email,
  });

  const request = supertest(app);

  test('should not create a task without authorization token', async () => {
    const task = TaskObjectMother.valid();

    const response = await request.post('/tasks').send(task);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not create a task with invalid name', async () => {
    const task = TaskObjectMother.withInvalidName();

    const response = await request
      .post('/tasks')
      .send(task)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Nome invalido!');
  });

  test('should create a task with without description', async () => {
    const task = TaskObjectMother.withoutDescription();

    const response = await request
      .post('/tasks')
      .send({ ...task, userId: EXISTING_USER.id })
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Created);
  });

  test('should create a task with without priority', async () => {
    const task = TaskObjectMother.withoutPriority();

    const response = await request
      .post('/tasks')
      .send({ ...task, userId: EXISTING_USER.id })
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Created);
  });

  test('should create a task with without done', async () => {
    const task = TaskObjectMother.withoutDone();

    const response = await request
      .post('/tasks')
      .send({ ...task, userId: EXISTING_USER.id })
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Created);
  });
});
