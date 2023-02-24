import { expect, describe, test, beforeAll } from '@jest/globals';

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
    await knex('users').del();

    const [userId] = await createUser(existingUser);

    existingUser.id = userId;

    const [task] = await createTask({ ...existingTask, userId });

    existingTask.id = task.id;

    validToken = tokenGenerator({ id: userId, email: existingUser.email });
  });

  test('should not mark task as done without authorization token', async () => {
    const task = TaskObjectMother.valid();

    const response = await request(app)
      .post('/tasks/finish/' + existingTask.id)
      .send(task);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not mark task as done with invalid task id', async () => {
    const { id: invalidId } = TaskObjectMother.withInvalidId();

    const response = await request(app)
      .post('/tasks/finish/' + invalidId)
      .set('authorization', `bearer ${validToken}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
  });

  test('should mark task as done with valid task id', async () => {
    console.log(existingTask.id);

    const response = await request(app)
      .post('/tasks/finish/' + existingTask.id)
      .set('authorization', `bearer ${validToken}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);
  });
});
