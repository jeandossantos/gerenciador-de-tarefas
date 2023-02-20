import { jest, test, describe, expect, beforeEach } from '@jest/globals';

import { UpdateUserPasswordService } from '../../../../src/service/user/updateUserPasswordService.mjs';
import { UserObjectMother } from '../../../model/user/userObjectMother.mjs';
import { UserError } from '../../../../src/errors/userError.mjs';
import { Util } from '../../../../src/utils/util.mjs';

describe('#UpdateUserPasswordService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('#UpdateUserPasswordService should not update the password of the user with invalid old password', async () => {
    const userRepositoryMock = {
      updatePassword: jest.fn(),
    };

    const { password: oldPassword, id } =
      UserObjectMother.withInvalidPassword();

    const passwordsMock = {
      id,
      oldPassword,
      newPassword: 'newPassword',
      confirmNewPassword: 'newPassword',
    };

    const updateUserPasswordService = new UpdateUserPasswordService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Senha do usuário incorreta!');

    await expect(
      updateUserPasswordService.execute(passwordsMock)
    ).rejects.toThrowError(expectedError);

    expect(userRepositoryMock.updatePassword).not.toHaveBeenCalled();
  });

  test('#UpdateUserPasswordService should not update the password of the user with invalid new password', async () => {
    const userRepositoryMock = {
      updatePassword: jest.fn(),
    };

    const { id, password: oldPassword } = UserObjectMother.valid();

    const passwordsMock = {
      id,
      oldPassword,
      newPassword: '12345',
      confirmNewPassword: 'newPassword',
    };

    const updateUserPasswordService = new UpdateUserPasswordService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Nova senha invalida!');

    await expect(
      updateUserPasswordService.execute(passwordsMock)
    ).rejects.toThrowError(expectedError);

    expect(userRepositoryMock.updatePassword).not.toHaveBeenCalled();
  });

  test('#UpdateUserPasswordService should not update the password of the user if the new password and confirm new password does not match', async () => {
    const userRepositoryMock = {
      updatePassword: jest.fn(),
    };

    const user = UserObjectMother.withInvalidConfirmPassword();

    const passwordsMock = {
      id: user.id,
      oldPassword: user.password,
      newPassword: user.password,
      confirmNewPassword: user.confirmPassword,
    };

    const updateUserPasswordService = new UpdateUserPasswordService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Senhas não coincidem!');

    await expect(
      updateUserPasswordService.execute(passwordsMock)
    ).rejects.toThrowError(expectedError);

    expect(userRepositoryMock.updatePassword).not.toHaveBeenCalled();
  });

  test('#UpdateUserPasswordService should not update the password of the user if the od password and current password does not match', async () => {
    const user = UserObjectMother.valid();

    const userRepositoryMock = {
      updatePassword: jest.fn(),
      findById: jest.fn().mockResolvedValue({
        ...user,
        password: Util.encryptPassword(user.password),
      }),
    };

    const validPassword = 'password-valid';

    const passwordsMock = {
      id: user.id,
      oldPassword: validPassword,
      newPassword: validPassword,
      confirmNewPassword: validPassword,
    };

    const updateUserPasswordService = new UpdateUserPasswordService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Senha do usuário incorreta!');

    await expect(
      updateUserPasswordService.execute(passwordsMock)
    ).rejects.toThrowError(expectedError);

    expect(userRepositoryMock.findById).toHaveBeenCalled();
    expect(userRepositoryMock.updatePassword).not.toHaveBeenCalled();
  });

  test('#UpdateUserPasswordService should not update the password of the user if the od password and current password does not match', async () => {
    const user = UserObjectMother.valid();

    const userRepositoryMock = {
      updatePassword: jest.fn(),
      findById: jest.fn().mockResolvedValue({
        ...user,
        password: Util.encryptPassword(user.password),
      }),
    };

    const validPassword = 'password-valid';

    const passwordsMock = {
      id: user.id,
      oldPassword: user.password,
      newPassword: validPassword,
      confirmNewPassword: validPassword,
    };

    const updateUserPasswordService = new UpdateUserPasswordService({
      userRepository: userRepositoryMock,
    });

    await updateUserPasswordService.execute(passwordsMock);

    expect(userRepositoryMock.findById).toHaveBeenCalled();
    expect(userRepositoryMock.updatePassword).toHaveBeenCalled();
  });
});
