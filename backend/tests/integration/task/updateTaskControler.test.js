import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { TaskObjectMother } from '../../model/task/taskObjectMother.mjs';
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

async function createTask({
  name,
  description,
  priority,
  done,
  userId,
  deadline,
}) {
  return await knex('tasks').insert(
    {
      name,
      description,
      priority,
      done,
      deadline,
      userId,
    },
    'id'
  );
}

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return token;
}

describe('#UpdateTaskController - Integration', () => {
  const user = UserObjectMother.valid();
  const task = TaskObjectMother.valid();

  let existingUser = Object.assign({}, user, {
    name: 'existing-user',
    email: 'existing-user@example.com',
    initiais: user.initials,
  });

  let existingTask = Object.assign({}, task, {
    name: 'markAsDoneTest',
  });

  beforeAll(async () => {
    await knex('users').where('id', '>', 1).del();

    const [userId] = await createUser(existingUser);

    existingUser.id = userId;

    const [task] = await createTask({ ...existingTask, userId });

    existingTask.id = task.id;
  });

  afterAll(() => knex('users').del());

  const VALID_TOKEN =
    'bearer ' +
    tokenGenerator({
      id: existingUser.id,
      email: existingUser.email,
    });

  const request = supertest(app);

  test('should return 401 with invalid authentication token', async () => {
    const response = await request.put(`/tasks/${existingTask.id}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not update a user with an invalid name', async () => {
    const task = TaskObjectMother.withInvalidName();

    const response = await request
      .put(`/tasks/${existingTask.id}`)
      .send(task)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Nome invalido!');
  });

  test('should update a user with an valid user', async () => {
    const task = TaskObjectMother.valid();

    const response = await request
      .put(`/tasks/${existingTask.id}`)
      .send(task)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);
  });
});
