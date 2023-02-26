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

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return token;
}

describe('#CreateTaskController - Integration', () => {
  const user = UserObjectMother.valid();

  let existingUser = Object.assign({}, user, {
    name: 'existing-user',
    email: 'existing-user@example.com',
  });

  let validToken = null;

  beforeAll(async () => {
    await knex('users').where('id', '>', 1).del();

    const [userId] = await createUser(existingUser);

    existingUser.id = userId;

    validToken = tokenGenerator({ id: userId, email: existingUser.email });
  });

  afterAll(async () => {
    await knex('users').where({ id: existingUser.id }).del();

    return await knex('tasks').where('id', '>', 1).del();
  });

  test('should not create a task without authorization token', async () => {
    const task = TaskObjectMother.valid();

    const response = await request(app).post('/tasks').send(task);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not create a task with invalid name', async () => {
    const task = TaskObjectMother.withInvalidName();

    const response = await request(app)
      .post('/tasks')
      .send(task)
      .set('authorization', `bearer ${validToken}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Nome invalido!');
  });

  test('should create a task with without description', async () => {
    const task = TaskObjectMother.withoutDescription();

    const response = await request(app)
      .post('/tasks')
      .send({ ...task, userId: existingUser.id })
      .set('authorization', `bearer ${validToken}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Created);
  });

  test('should create a task with without priority', async () => {
    const task = TaskObjectMother.withoutPriority();

    const response = await request(app)
      .post('/tasks')
      .send({ ...task, userId: existingUser.id })
      .set('authorization', `bearer ${validToken}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Created);
  });

  test('should create a task with without done', async () => {
    const task = TaskObjectMother.withoutDone();

    const response = await request(app)
      .post('/tasks')
      .send({ ...task, userId: existingUser.id })
      .set('authorization', `bearer ${validToken}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Created);
  });
});
