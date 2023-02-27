import { test, describe, expect, afterAll, beforeAll } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';

const { user: EXISTING_USER } = await populateDatabase();

describe('#CreateUser - Integration', () => {
  EXISTING_USER.confirmPassword = EXISTING_USER.password;

  const request = supertest(app);

  test('should not create a user with an invalid name', async () => {
    const user = UserObjectMother.withInvalidName();

    const response = await request.post('/signup').send({
      ...user,
      initiais: user.initiais,
    });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toStrictEqual('Nome invalido!');
  });

  test('should not create a user with an invalid email', async () => {
    const user = UserObjectMother.withInvalidEmail();

    const response = await request.post('/signup').send({
      ...user,
      initiais: user.initiais,
    });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toStrictEqual('E-mail invalido!');
  });

  test('should not create a user with an invalid initials', async () => {
    const user = UserObjectMother.withInvalidInitials();

    const response = await request.post('/signup').send({
      ...user,
      initiais: user.initials,
    });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toStrictEqual('Iniciais invalidas!');
  });

  test('should not create a user with an invalid password', async () => {
    const user = UserObjectMother.withInvalidPassword();

    const response = await request.post('/signup').send({
      ...user,
      initiais: user.initials,
    });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toStrictEqual('Senha invalida!');
  });

  test('should not create a user if the passwords do not match ', async () => {
    const user = UserObjectMother.withInvalidConfirmPassword();

    const response = await request.post('/signup').send({
      ...user,
      initiais: user.initials,
    });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toStrictEqual('Senhas não coincidem!');
  });

  test('should not create a user if user already exists', async () => {
    const user = UserObjectMother.withInvalidConfirmPassword();
    const existingUser = Object.assign({}, user, EXISTING_USER, {
      initiais: user.initials,
    });

    const response = await request.post('/signup').send(existingUser);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toStrictEqual('Usuário já existe!');
  });

  test('should create a user successfully', async () => {
    const user = UserObjectMother.valid();

    const response = await request.post('/signup').send({
      ...user,
      initiais: user.initials,
    });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Created);
  });
});
