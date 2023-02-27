import {
  jest,
  test,
  describe,
  expect,
  beforeAll,
  afterAll,
} from '@jest/globals';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';

import { app } from '../../../src/app.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { clearDatabase, populateDatabase } from '../../TestService.mjs';

function tokenGenerator({ id, email }) {
  const token = jwt.sign({ id, email }, process.env.SECRET_OR_KEY);

  return `bearer ${token}`;
}

const { user: EXISTING_USER } = await populateDatabase();

describe('#RemoveUserController - Integration', () => {
  const user = UserObjectMother.valid();
  EXISTING_USER.password = user.password;

  let VALID_TOKEN = tokenGenerator({
    email: EXISTING_USER,
    id: EXISTING_USER.id,
  });

  const request = supertest(app);

  test('should not remove a user without authorization token', async () => {
    const user = UserObjectMother.withInvalidId();

    const response = await request.delete(`/users/${EXISTING_USER.id}`);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not remove a user fail with invalid id', async () => {
    const user = UserObjectMother.withInvalidId();

    const response = await request
      .delete(`/users/${user.id}`)
      .set('authorization', VALID_TOKEN)
      .set('userpassword', '');

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);

    expect(response.text).toBe('Usuário não encontrado!');
  });

  test('#RemoveUserService should fail with invalid password', async () => {
    const invalidPassword = '';

    const response = await request
      .delete(`/users/${EXISTING_USER.id}`)
      .set('authorization', VALID_TOKEN)
      .set('userpassword', invalidPassword);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);

    expect(response.text).toBe('Senha do usuário incorreta!');
  });

  test('#RemoveUserService should fail if user password does not Match', async () => {
    const invalidPassword = UserObjectMother.withInvalidPassword();
    const response = await request
      .delete(`/users/${EXISTING_USER.id}`)
      .set('authorization', VALID_TOKEN)
      .set('userpassword', invalidPassword);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);

    expect(response.text).toBe('Senha do usuário incorreta!');
  });

  test('#RemoveUserService should remove a user', async () => {
    const response = await request
      .delete(`/users/${EXISTING_USER.id}`)
      .set('authorization', VALID_TOKEN)
      .set('userpassword', EXISTING_USER.password);

    expect(response.statusCode).toBe(Util.STATUS_CODES.No_Content);
  });
});
