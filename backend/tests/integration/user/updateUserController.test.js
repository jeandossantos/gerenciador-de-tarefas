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

  test('should not update a user without authentication credentials', async () => {
    const response = await request(app).put('/users/' + existingUser.id);

    expect(response.statusCode).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should not update a user with invalid id', async () => {
    const { id: invalidId, ...user } = UserObjectMother.withInvalidId();

    const response = await request(app)
      .put(`/users/${invalidId}`)
      .set('authorization', `bearer ${validToken}`)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Não encontrado!');
  });

  test('should not update a user with invalid name', async () => {
    const user = UserObjectMother.withInvalidName();

    const response = await request(app)
      .put(`/users/${existingUser.id}`)
      .set('authorization', `bearer ${validToken}`)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Nome invalido!');
  });

  test('should not update a user with invalid initials', async () => {
    const user = UserObjectMother.withInvalidInitials();

    const response = await request(app)
      .put(`/users/${existingUser.id}`)
      .set('authorization', `bearer ${validToken}`)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('Iniciais invalidas!');
  });

  test('should not update a user with invalid email', async () => {
    const user = UserObjectMother.withInvalidEmail();

    const response = await request(app)
      .put(`/users/${existingUser.id}`)
      .set('authorization', `bearer ${validToken}`)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.Bad_Request);
    expect(response.text).toBe('E-mail invalido!');
  });

  test('should update with valid value user', async () => {
    const user = UserObjectMother.valid();

    const response = await request(app)
      .put(`/users/${existingUser.id}`)
      .set('authorization', `bearer ${validToken}`)
      .send({ ...user, initiais: user.initials });

    expect(response.statusCode).toBe(Util.STATUS_CODES.No_Content);
  });
});
