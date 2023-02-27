import { test, describe, expect, afterAll } from '@jest/globals';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return `bearer ${token}`;
}

const { user: EXISTING_USER } = await populateDatabase();

describe('#UpdateUserPasswordController - Integration', () => {
  const user = UserObjectMother.valid();
  EXISTING_USER.password = user.password;

  const VALID_TOKEN = tokenGenerator({
    email: EXISTING_USER,
    id: EXISTING_USER.id,
  });

  const request = supertest(app);

  const INVALID_PASSWORD = '';
  const INVALID_CURRENT_PASSWORD = 'invalid-current-password';
  const INVALID_CONFIRM_NEW_PASSWORD = '987654321';

  const CURRENT_PASSWORD = EXISTING_USER.password;
  const VALID_NEW_PASSWORD = 'new-password';

  test('should not update without authorization token', async () => {
    const data = {
      oldPassword: CURRENT_PASSWORD,
      newPassword: VALID_NEW_PASSWORD,
      confirmPassword: VALID_NEW_PASSWORD,
    };

    const response = await request
      .put('/users/update/' + EXISTING_USER.id)
      .send(data);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not update the password of the user with invalid old password', async () => {
    const data = {
      oldPassword: INVALID_PASSWORD,
      newPassword: INVALID_PASSWORD,
      confirmNewPassword: INVALID_PASSWORD,
    };

    const response = await request
      .put('/users/update/' + EXISTING_USER.id)
      .send(data)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);

    expect(response.text).toBe('Senha do usuário incorreta!');
  });

  test('should not update the password of the user with invalid new password', async () => {
    const data = {
      oldPassword: CURRENT_PASSWORD,
      newPassword: INVALID_PASSWORD,
      confirmNewPassword: INVALID_PASSWORD,
    };

    const response = await request
      .put('/users/update/' + EXISTING_USER.id)
      .send(data)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Nova senha invalida!');
  });

  test('should not update the password of the user if the new password and confirm new password does not match', async () => {
    const data = {
      oldPassword: CURRENT_PASSWORD,
      newPassword: VALID_NEW_PASSWORD,
      confirmNewPassword: INVALID_CONFIRM_NEW_PASSWORD,
    };

    const response = await request
      .put('/users/update/' + EXISTING_USER.id)
      .send(data)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Senhas não coincidem!');
  });

  test('should not update the password of the user if the od password and current password does not match', async () => {
    const data = {
      oldPassword: INVALID_CURRENT_PASSWORD,
      newPassword: VALID_NEW_PASSWORD,
      confirmNewPassword: VALID_NEW_PASSWORD,
    };

    const response = await request
      .put('/users/update/' + EXISTING_USER.id)
      .send(data)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Senha do usuário incorreta!');
  });

  test('should be able to update the password of the user', async () => {
    const data = {
      oldPassword: CURRENT_PASSWORD,
      newPassword: VALID_NEW_PASSWORD,
      confirmNewPassword: VALID_NEW_PASSWORD,
    };

    const response = await request
      .put('/users/update/' + EXISTING_USER.id)
      .send(data)
      .set('authorization', VALID_TOKEN);

    expect(response.statusCode).toBe(Util.STATUS_CODES.No_Content);
  });
});
