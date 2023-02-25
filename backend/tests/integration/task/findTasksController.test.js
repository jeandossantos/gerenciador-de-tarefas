import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';

import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';

import { connection as knex } from '../../../src/database/knex.mjs';

async function createUser({ name, email, initials, password }) {
  await knex('users').del();

  return await knex('users').insert(
    {
      name,
      email,
      initials,
      password: Util.encryptPassword(password),
    },
    'id'
  );
}

async function createTasks(tasks) {
  return await knex('tasks').insert(tasks);
}

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return token;
}

const user = UserObjectMother.valid();

let existingUser = Object.assign({}, user, {
  name: 'existing-user',
  email: 'existing-user@example.com',
  initiais: user.initials,
});

const [createdUser] = await createUser(existingUser);

existingUser.id = createdUser.id;

const tasks = [
  {
    name: 'my task 1',
    done: true,
    userId: existingUser.id,
    priority: 0,
    deadline: new Date(),
  },
  {
    name: ' my task 2',
    done: false,
    userId: existingUser.id,
    priority: 0,
    deadline: new Date(),
  },
  {
    name: 'my task 3',
    done: true,
    userId: existingUser.id,
    priority: 0,
    deadline: new Date(),
  },
  {
    name: 'my  task 4',
    done: false,
    userId: existingUser.id,
    priority: 0,
    deadline: new Date(),
  },
];

describe('#FindTasksController - Integration', () => {
  beforeAll(() => createTasks(tasks));

  afterAll(async () => {
    return await knex('users').where({ id: existingUser.id }).del();
  });

  const VALID_TOKEN =
    'bearer ' +
    tokenGenerator({
      id: existingUser.id,
      email: existingUser.email,
    });

  const request = supertest(app);

  test('should not be able to find tasks without authorization token', async () => {
    const response = await request.get('/tasks');

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not find tasks with invalid owner id', async () => {
    const response = await request
      .get('/tasks')
      .set('Authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('count');
  });
});
