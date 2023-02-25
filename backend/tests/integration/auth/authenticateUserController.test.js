import { test, describe, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
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

describe('Authentication user - integration', () => {
  beforeAll(async () => {
    await knex('users').where('id', '>', 1).del();

    const user = UserObjectMother.valid();

    await createUser(user);
  });

  afterAll(async () => {
    return await knex('users').where('id', '>', 1).del();
  });

  test('should not be able to authenticate with an invalid email', async () => {
    const user = UserObjectMother.withInvalidEmail();

    const response = await request(app).post('/signin').send(user);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Informe E-mail e senha!');
  });

  test('should not be able to authenticate with an invalid password', async () => {
    const user = UserObjectMother.withInvalidPassword();

    const response = await request(app).post('/signin').send(user);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Usuário/Senha inválidos!');
  });

  test('should not be able to authenticate if user does not exists', async () => {
    const { password } = UserObjectMother.valid();

    const nonexistentUser = {
      email: 'noneistent-user@example.com',
      password,
    };

    const response = await request(app).post('/signin').send(nonexistentUser);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Usuário não encontrado!');
  });

  test('should be able to authenticate with valid credentials', async () => {
    const user = UserObjectMother.valid();

    const response = await request(app).post('/signin').send(user);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('initiais');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('token');
  });
});
