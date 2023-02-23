import { test, describe, expect, beforeAll } from '@jest/globals';
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

describe('#CreateUser - Integration', () => {
  let existingUser = null;

  beforeAll(async () => {
    await knex('users').del();
    const { password, initials, confirmPassword } = UserObjectMother.valid();

    existingUser = {
      name: 'existing-user',
      initials,
      email: 'existing-user@example.com',
      password,
      confirmPassword,
    };

    existingUser.id = await createUser(existingUser)[0];
  });

  test('should not create a user with an invalid name', async () => {
    const user = UserObjectMother.withInvalidName();

    const response = await request(app).post('/signup').send(user);

    expect(response.body.error).toStrictEqual('Nome invalido!');
    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
  });

  test('should not create a user with an invalid email', async () => {
    const user = UserObjectMother.withInvalidEmail();

    const response = await request(app).post('/signup').send(user);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toStrictEqual('E-mail invalido!');
  });

  test('should not create a user with an invalid initials', async () => {
    const user = UserObjectMother.withInvalidInitials();

    const response = await request(app)
      .post('/signup')
      .send({
        ...user,
        initiais: user.initials,
      });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toStrictEqual('Iniciais invalidas!');
  });

  test('should not create a user with an invalid password', async () => {
    const user = UserObjectMother.withInvalidPassword();

    const response = await request(app)
      .post('/signup')
      .send({
        ...user,
        initiais: user.initials,
      });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toStrictEqual('Senha invalida!');
  });

  test('should not create a user if the passwords do not match ', async () => {
    const user = UserObjectMother.withInvalidConfirmPassword();

    const response = await request(app)
      .post('/signup')
      .send({
        ...user,
        initiais: user.initials,
      });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toStrictEqual('Senhas não coincidem!');
  });

  test('should not create a user if user already exists', async () => {
    const user = Object.assign({}, existingUser);

    const response = await request(app)
      .post('/signup')
      .send({
        ...user,
        initiais: user.initials,
      });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toStrictEqual('Usuário já existe!');
  });

  test('should create a user successfully', async () => {
    const user = UserObjectMother.valid();

    const response = await request(app)
      .post('/signup')
      .send({
        ...user,
        initiais: user.initials,
      });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Created);
  });
});
