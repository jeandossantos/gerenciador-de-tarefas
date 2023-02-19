import { jest, test, describe, expect, beforeEach } from '@jest/globals';

import { UpdateUserService } from '../../../../src/service/updateUserService.mjs';
import { UserError } from '../../../../src/errors/userError.mjs';
import { UserObjectMother } from '../../../model/user/userObjectMother.mjs';
import { Util } from '../../../../src/utils/util.mjs';

describe('#UpdateUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('#UpdateUserService should not update a user with invalid id', async () => {
    const userRepositoryMock = {
      update: jest.fn(),
    };

    const user = UserObjectMother.withInvalidId();

    const updateUserService = new UpdateUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Não encontrado!');

    await expect(updateUserService.execute(user)).rejects.toThrowError(
      expectedError
    );

    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  test('#UpdateUserService should not update a user with invalid name', async () => {
    const userRepositoryMock = {
      update: jest.fn(),
    };

    const user = UserObjectMother.withInvalidName();

    const updateUserService = new UpdateUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Nome invalido!');

    await expect(updateUserService.execute(user)).rejects.toThrowError(
      expectedError
    );

    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  test('#UpdateUserService should not update a user with invalid initials', async () => {
    const userRepositoryMock = {
      update: jest.fn(),
    };

    const user = UserObjectMother.withInvalidInitials();

    const updateUserService = new UpdateUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Iniciais invalidas!');

    await expect(updateUserService.execute(user)).rejects.toThrowError(
      expectedError
    );

    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  test('#UpdateUserService should not update a user with invalid email', async () => {
    const userRepositoryMock = {
      update: jest.fn(),
    };

    const user = UserObjectMother.withInvalidEmail();

    const updateUserService = new UpdateUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('E-mail invalido!');

    await expect(updateUserService.execute(user)).rejects.toThrowError(
      expectedError
    );

    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  test('#UpdateUserService should update with valid value user', async () => {
    const userRepositoryMock = {
      update: jest.fn(),
    };

    const updateUserService = new UpdateUserService({
      userRepository: userRepositoryMock,
    });

    const user = UserObjectMother.valid();

    const result = await updateUserService.execute(user);

    expect(result).toBeUndefined();
    expect(userRepositoryMock.update).toHaveBeenCalled();
  });
});
