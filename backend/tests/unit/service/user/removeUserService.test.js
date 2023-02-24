import { jest, test, describe, expect, beforeEach } from '@jest/globals';
import { UserError } from '../../../../src/errors/userError.mjs';
import { UserObjectMother } from '../../../model/user/userObjectMother.mjs';
import { RemoveUserService } from '../../../../src/service/user/removeUserService.mjs';
import { Util } from '../../../../src/utils/util.mjs';

describe('#RemoveUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('#RemoveUserService should fail with invalid id', async () => {
    const userRepositoryMock = {
      remove: jest.fn(),
    };

    const user = UserObjectMother.withInvalidId();

    const removeUserService = new RemoveUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Usuário não encontrado!');

    await expect(removeUserService.execute(user)).rejects.toThrowError(
      expectedError
    );
  });

  test('#RemoveUserService should fail with invalid password', async () => {
    const userRepositoryMock = {
      remove: jest.fn(),
    };

    const user = UserObjectMother.withInvalidPassword();

    const removeUserService = new RemoveUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Senha do usuário incorreta!');

    await expect(removeUserService.execute(user)).rejects.toThrowError(
      expectedError
    );
  });

  test('#RemoveUserService should fail if user password does not Match', async () => {
    const userRepositoryMock = {
      remove: jest.fn(),
      findById: jest
        .fn()
        .mockReturnValue(UserObjectMother.withInvalidPassword()),
    };

    const user = UserObjectMother.valid();

    const removeUserService = new RemoveUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Senha do usuário incorreta!');

    await expect(removeUserService.execute(user)).rejects.toThrowError(
      expectedError
    );

    expect(userRepositoryMock.findById).toHaveBeenCalled();
  });

  test('#RemoveUserService should not be able to remove a user if user is not found', async () => {
    const userRepositoryMock = {
      remove: jest.fn(),
      findById: jest.fn().mockReturnValue(undefined),
    };

    const user = UserObjectMother.valid();

    const removeUserService = new RemoveUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Não encontrado!');

    const result = removeUserService.execute(user);

    await expect(result).rejects.toThrowError(expectedError);

    expect(userRepositoryMock.findById).toHaveBeenCalled();
    expect(userRepositoryMock.remove).not.toHaveBeenCalled();
  });

  test('#RemoveUserService should remove a user', async () => {
    const userRepositoryMock = {
      remove: jest.fn(),
      findById: jest.fn().mockReturnValue({
        password: Util.encryptPassword(UserObjectMother.valid().password),
      }),
    };

    const user = UserObjectMother.valid();

    const removeUserService = new RemoveUserService({
      userRepository: userRepositoryMock,
    });

    await removeUserService.execute(user);

    expect(userRepositoryMock.findById).toHaveBeenCalled();
    expect(userRepositoryMock.remove).toHaveBeenCalled();
  });
});
