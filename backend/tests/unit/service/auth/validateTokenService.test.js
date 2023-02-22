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
import { ValidateTokenService } from '../../../../src/service/auth/validateTokenService.mjs';

describe('#ValidateTokenService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  test('should returns false with invalid token', async () => {
    const invalidToken = 'bearer invalid token';

    const userRepositoryMock = {
      findById: jest.fn(),
    };

    const validateTokenService = new ValidateTokenService({
      userRepository: userRepositoryMock,
    });

    const expected = false;
    const result = await validateTokenService.execute(invalidToken);

    expect(result).toBe(expected);
  });

  test('should returns false if user was not found', async () => {
    const user = UserObjectMother.valid();

    const validToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_OR_KEY
    );

    const userRepositoryMock = {
      findById: jest.fn().mockReturnValue(undefined),
    };

    const validateTokenService = new ValidateTokenService({
      userRepository: userRepositoryMock,
    });

    const expected = false;
    const result = await validateTokenService.execute(validToken);

    expect(result).toBe(expected);
    expect(userRepositoryMock.findById).toHaveBeenCalled();
  });

  test('should returns true with valid token', async () => {
    const user = UserObjectMother.valid();

    const validToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_OR_KEY
    );

    const userRepositoryMock = {
      findById: jest.fn().mockReturnValue(user),
    };

    const validateTokenService = new ValidateTokenService({
      userRepository: userRepositoryMock,
    });

    const expected = true;
    const result = await validateTokenService.execute(validToken);

    expect(result).toBe(expected);
    expect(userRepositoryMock.findById).toHaveBeenCalled();
  });
});
