import * as dotenv from 'dotenv';
dotenv.config();

import {
  jest,
  test,
  describe,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AuthError } from '../../../../src/errors/authError.mjs';
import { UserObjectMother } from '../../../model/user/userObjectMother.mjs';
import { AuthenticateUserService } from '../../../../src/service/auth/authenticateUserService.mjs';

describe('#AuthenticateUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  test('should not authenticate a user with invalid email', async () => {
    const { email, password } = UserObjectMother.withInvalidEmail();

    const authData = { email, password };

    const userRepositoryMock = {
      findByEmail: jest.fn(),
    };

    const authenticateUserService = new AuthenticateUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new AuthError('Informe E-mail e senha!');

    await expect(
      authenticateUserService.execute(authData)
    ).rejects.toThrowError(expectedError);

    expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
  });

  test('should not authenticate a user with invalid email', async () => {
    const { email, password } = UserObjectMother.withInvalidPassword();

    const authData = { email, password };

    const userRepositoryMock = {
      findByEmail: jest.fn(),
    };

    const authenticateUserService = new AuthenticateUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new AuthError('Usuário/Senha inválidos!');

    await expect(
      authenticateUserService.execute(authData)
    ).rejects.toThrowError(expectedError);

    expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
  });

  test('should not authenticate if the user does not be found', async () => {
    const { email, password } = UserObjectMother.valid();

    const authData = { email, password };

    const userRepositoryMock = {
      findByEmail: jest.fn(),
    };

    const authenticateUserService = new AuthenticateUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new AuthError('Usuário não encontrado!');

    await expect(
      authenticateUserService.execute(authData)
    ).rejects.toThrowError(expectedError);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalled();
  });

  test('should not authenticate if the passwords does not match', async () => {
    const user = UserObjectMother.valid();

    const authData = { email: user.email, password: user.password };

    const userRepositoryMock = {
      findByEmail: jest.fn().mockResolvedValue({}),
    };

    const compareSyncSpy = jest
      .spyOn(bcrypt, bcrypt.compareSync.name)
      .mockReturnValue(false);

    const authenticateUserService = new AuthenticateUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new AuthError('Usuário/Senha inválidos!');

    await expect(
      authenticateUserService.execute(authData)
    ).rejects.toThrowError(expectedError);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalled();
    expect(compareSyncSpy).toHaveBeenCalledTimes(1);
  });

  test('should authenticate with valid credentials', async () => {
    const user = UserObjectMother.valid();

    const authData = { email: user.email, password: user.password };

    const userRepositoryMock = {
      findByEmail: jest.fn().mockResolvedValue(user),
    };

    const compareSyncSpy = jest
      .spyOn(bcrypt, bcrypt.compareSync.name)
      .mockReturnValue(true);

    const authenticateUserService = new AuthenticateUserService({
      userRepository: userRepositoryMock,
    });

    const signSpy = jest.spyOn(jwt, 'sign').mockResolvedValue('');

    const result = await authenticateUserService.execute(authData);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('initiais');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('token');

    expect(userRepositoryMock.findByEmail).toHaveBeenCalled();
    expect(compareSyncSpy).toHaveBeenCalled();
    expect(signSpy).toHaveBeenCalled();
  });
});
