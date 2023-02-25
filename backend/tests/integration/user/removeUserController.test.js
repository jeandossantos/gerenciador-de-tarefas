import {
  jest,
  test,
  describe,
  expect,
  beforeEach,
  afterAll,
} from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

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

describe('#RemoveUserController - Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  let existingUser = null;
  let validToken = null;

  beforeAll(async () => {
    await knex('users').where('id', '>', 1).del();

    const { password, initials, confirmPassword } = UserObjectMother.valid();

    existingUser = {
      name: 'existing-user',
      initials,
      email: 'existing-user@example.com',
      password,
      confirmPassword,
    };

    const [userId] = await createUser(existingUser);

    existingUser.id = userId;

    validToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.SECRET_OR_KEY
    );
  });

  afterAll(async () => {
    return await knex('users').where({ id: existingUser.id }).del();
  });

  test('should not remove a user without authorization token', async () => {
    const user = UserObjectMother.withInvalidId();

    const response = await request(app)
      .delete(`/users/${user.id}`)
      .set('userpassword', '');

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should fail with invalid id', async () => {
    const user = UserObjectMother.withInvalidId();

    const response = await request(app)
      .delete(`/users/${user.id}`)
      .set('authorization', 'bearer ' + validToken)
      .set('userpassword', '');

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);

    expect(response.text).toBe('Usuário não encontrado!');
  });

  test('#RemoveUserService should fail with invalid password', async () => {
    const invalidPassword = '';

    const response = await request(app)
      .delete(`/users/${existingUser.id}`)
      .set('authorization', 'bearer ' + validToken)
      .set('userpassword', invalidPassword);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);

    expect(response.text).toBe('Senha do usuário incorreta!');
  });

  test('#RemoveUserService should fail if user password does not Match', async () => {
    const invalidPassword = UserObjectMother.withInvalidPassword();
    const response = await request(app)
      .delete(`/users/${existingUser.id}`)
      .set('authorization', 'bearer ' + validToken)
      .set('userpassword', invalidPassword);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);

    expect(response.text).toBe('Senha do usuário incorreta!');
  });

  test('#RemoveUserService should remove a user', async () => {
    const response = await request(app)
      .delete(`/users/${existingUser.id}`)
      .set('authorization', 'bearer ' + validToken)
      .set('userpassword', existingUser.password);

    expect(response.statusCode).toBe(Util.STATUS_CODES.No_Content);
  });
});
