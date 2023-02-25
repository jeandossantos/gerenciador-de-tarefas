import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';

import request from 'supertest';
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

  Reflect.deleteProperty(task, 'id');

  let existingUser = Object.assign({}, user, {
    name: 'existing-user',
    email: 'existing-user@example.com',
    initiais: user.initials,
  });

  let existingTask = Object.assign({}, task, {
    name: 'markAsDoneTest',
  });

  let validToken = null;

  beforeAll(async () => {
    await knex('users').where('id', '>', 1).del();

    const [userId] = await createUser(existingUser);

    existingUser.id = userId;

    const [task] = await createTask({ ...existingTask, userId });

    existingTask.id = task.id;

    validToken = tokenGenerator({ id: userId, email: existingUser.email });
  });

  afterAll(() => knex('users').del());

  test('should not find stats without authorization token', async () => {
    const response = await request(app).get('/stats');

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should find task stats', async () => {
    const response = await request(app)
      .get('/stats')
      .set('authorization', `bearer ${validToken}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);

    expect(response.body).toHaveProperty('expiredTasksCount');
    expect(response.body).toHaveProperty('totaltasksCount');
    expect(response.body).toHaveProperty('finishedTasksCount');
  });
});