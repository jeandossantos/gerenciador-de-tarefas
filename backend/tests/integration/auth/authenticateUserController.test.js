import { test, describe, expect, beforeAll, afterAll } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';
import { NONEXISTENT_USER } from '../../mock/nonexistent-user.mjs';

const { user: EXISTING_USER } = await populateDatabase();

describe('Authentication user - integration', () => {
  const user = UserObjectMother.valid();
  EXISTING_USER.password = user.password;

  const request = supertest(app);

  test('should not be able to authenticate with an invalid email', async () => {
    const user = UserObjectMother.withInvalidEmail();

    const response = await request.post('/signin').send(user);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Informe E-mail e senha!');
  });

  test('should not be able to authenticate with an invalid password', async () => {
    const user = UserObjectMother.withInvalidPassword();

    const response = await request.post('/signin').send(user);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Usuário/Senha inválidos!');
  });

  test('should not be able to authenticate if user does not exists', async () => {
    const response = await request.post('/signin').send(NONEXISTENT_USER);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Usuário não encontrado!');
  });

  test('should be able to authenticate with valid credentials', async () => {
    const credentials = {
      email: EXISTING_USER.email,
      password: EXISTING_USER.password,
    };
    const response = await request.post('/signin').send(credentials);

    expect(response.statusCode).toBe(Util.STATUS_CODES.OK);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('initiais');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('token');
  });
});
