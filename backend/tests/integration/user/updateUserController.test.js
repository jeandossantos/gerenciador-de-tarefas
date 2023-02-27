import { test, describe, expect, afterAll, beforeAll } from '@jest/globals';
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

describe('#UpdateUSer - Integration', () => {
  const user = UserObjectMother.valid();
  EXISTING_USER.password = user.password;

  const VALID_TOKEN = tokenGenerator({
    email: EXISTING_USER,
    id: EXISTING_USER.id,
  });

  const request = supertest(app);

  test('should not update a user without authentication credentials', async () => {
    const response = await request.put('/users/' + EXISTING_USER.id);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not update a user with invalid id', async () => {
    const { id: invalidId, ...user } = UserObjectMother.withInvalidId();

    const response = await request
      .put(`/users/${invalidId}`)
      .set('authorization', VALID_TOKEN)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Não encontrado!');
  });

  test('should not update a user with invalid name', async () => {
    const user = UserObjectMother.withInvalidName();

    const response = await request
      .put(`/users/${EXISTING_USER.id}`)
      .set('authorization', VALID_TOKEN)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Nome invalido!');
  });

  test('should not update a user with invalid initials', async () => {
    const user = UserObjectMother.withInvalidInitials();

    const response = await request
      .put(`/users/${EXISTING_USER.id}`)
      .set('authorization', VALID_TOKEN)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Iniciais invalidas!');
  });

  test('should not update a user with invalid email', async () => {
    const user = UserObjectMother.withInvalidEmail();

    const response = await request
      .put(`/users/${EXISTING_USER.id}`)
      .set('authorization', VALID_TOKEN)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('E-mail invalido!');
  });

  test('should update with valid value user', async () => {
    const user = UserObjectMother.valid();

    const response = await request
      .put(`/users/${EXISTING_USER.id}`)
      .set('authorization', VALID_TOKEN)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.No_Content);
  });
});
