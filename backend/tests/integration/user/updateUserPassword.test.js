import { jest, test, describe, expect, beforeEach } from '@jest/globals';
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

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return token;
}

describe('#UpdateUserPasswordController - Integration', () => {
  const user = UserObjectMother.valid();

  let existingUser = Object.assign({}, user, {
    name: 'existing-user',
    email: 'existing-user@example.com',
  });

  let validToken = null;

  beforeAll(async () => {
    await knex('users').del();

    const [userId] = await createUser(existingUser);

    existingUser.id = userId;

    validToken = tokenGenerator({ id: userId, email: existingUser.email });
  });

  afterAll(async () => {
    await knex('users').del();
  });

  const INVALID_PASSWORD = '';
  const INVALID_CURRENT_PASSWORD = 'invalid-current-password';
  const INVALID_CONFIRM_NEW_PASSWORD = '987654321';

  const CURRENT_PASSWORD = existingUser.password;
  const NEW_PASSWORD = 'new-password';
  const VALID_NEW_PASSWORD = '0123456789';

  test('should not update without authorization token', async () => {
    const data = {
      oldPassword: CURRENT_PASSWORD,
      newPassword: NEW_PASSWORD,
      confirmPassword: NEW_PASSWORD,
    };

    const response = await request(app)
      .put('/users/update/' + existingUser.id)
      .send(data);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not update the password of the user with invalid old password', async () => {
    const data = {
      oldPassword: INVALID_PASSWORD,
      newPassword: INVALID_PASSWORD,
      confirmNewPassword: INVALID_PASSWORD,
    };

    const response = await request(app)
      .put('/users/update/' + existingUser.id)
      .send(data)
      .set('authorization', 'bearer ' + validToken);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toBe('Senha do usuário incorreta!');
  });

  test('should not update the password of the user with invalid new password', async () => {
    const data = {
      oldPassword: CURRENT_PASSWORD,
      newPassword: INVALID_PASSWORD,
      confirmNewPassword: INVALID_PASSWORD,
    };

    const response = await request(app)
      .put('/users/update/' + existingUser.id)
      .send(data)
      .set('authorization', 'bearer ' + validToken);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toBe('Nova senha invalida!');
  });

  test('should not update the password of the user if the new password and confirm new password does not match', async () => {
    const data = {
      ldPassword: CURRENT_PASSWORD,
      newPassword: VALID_NEW_PASSWORD,
      confirmNewPassword: INVALID_CONFIRM_NEW_PASSWORD,
    };

    const response = await request(app)
      .put('/users/update/' + existingUser.id)
      .send({
        oldPassword: existingUser.password,
        newPassword: VALID_NEW_PASSWORD,
        confirmNewPassword: INVALID_CONFIRM_NEW_PASSWORD,
      })
      .set('authorization', 'bearer ' + validToken);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toBe('Senhas não coincidem!');
  });

  test('should not update the password of the user if the od password and current password does not match', async () => {
    const data = {
      oldPassword: INVALID_CURRENT_PASSWORD,
      newPassword: VALID_NEW_PASSWORD,
      confirmNewPassword: VALID_NEW_PASSWORD,
    };
    console.log('[id]', existingUser.id);

    const response = await request(app)
      .put('/users/update/' + existingUser.id)
      .send(data)
      .set('authorization', 'bearer ' + validToken);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.body.error).toBe('Senha do usuário incorreta!');
  });

  test('should be able to update the password of the user', async () => {
    const data = {
      oldPassword: CURRENT_PASSWORD,
      newPassword: VALID_NEW_PASSWORD,
      confirmNewPassword: VALID_NEW_PASSWORD,
    };

    const response = await request(app)
      .put('/users/update/' + existingUser.id)
      .send(data)
      .set('authorization', 'bearer ' + validToken);

    expect(response.statusCode).toBe(Util.STATUS_CODES.No_Content);
  });
});
