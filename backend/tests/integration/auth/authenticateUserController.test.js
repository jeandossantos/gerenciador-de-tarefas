import { test, describe, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';

import { connection as knex } from '../../../src/database/knex.mjs';

beforeAll(async () => {
  const user = UserObjectMother.valid();

  Reflect.deleteProperty(user, 'confirmPassword');

  await knex('users').del();
  await knex('users').insert({
    ...user,
    password: Util.encryptPassword(user.password),
  });
});

describe('Authentication user - integration', () => {
  test('should not be able to authenticate with an invalid email', async () => {
    const user = UserObjectMother.withInvalidEmail();

    const response = await request(app).post('/signin').send(user);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toBe('Informe E-mail e senha!');
  });

  test('should not be able to authenticate with an invalid password', async () => {
    const user = UserObjectMother.withInvalidPassword();

    const response = await request(app).post('/signin').send(user);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toBe('Usuário/Senha inválidos!');
  });

  test('should not be able to authenticate if user does not exists', async () => {
    const { password } = UserObjectMother.valid();

    const nonexistentUser = {
      email: 'noneistent-user@example.com',
      password,
    };

    const response = await request(app).post('/signin').send(nonexistentUser);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toBe('Usuário não encontrado!');
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
