import { jest, test, describe, expect, beforeEach } from '@jest/globals';
import { UserError } from '../../src/errors/userError.mjs';
import { CreateUserService } from '../../src/service/createUserService.mjs';
import { UserObjectMother } from '../model/user/userObjectMother.mjs';

describe('#CreateUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('#CreateUserService should fail with invalid name', async () => {
    const userRepositoryMock = {
      create: jest.fn(),
    };

    const createUserService = new CreateUserService({
      userRepository: userRepositoryMock,
    });

    const user = UserObjectMother.withInvalidName();

    const expected = new UserError('Nome invalido!');
    const result = createUserService.execute(user);

    expect(result).rejects.toThrowError(expected);
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  test('#CreateUserService should fail with invalid initials', async () => {
    const userRepositoryMock = {
      create: jest.fn(),
    };

    const createUserService = new CreateUserService({
      userRepository: userRepositoryMock,
    });

    const user = UserObjectMother.withInvalidInitials();

    const expected = new UserError('Iniciais invalidas!');

    const result = createUserService.execute(user);

    await expect(result).rejects.toThrowError(expected);
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  test('#CreateUserService should fail with invalid email', async () => {
    const userRepositoryMock = {
      create: jest.fn(),
    };

    const createUserService = new CreateUserService({
      userRepository: userRepositoryMock,
    });

    const user = UserObjectMother.withInvalidEmail();

    const expected = new UserError('E-mail invalido!');

    const result = createUserService.execute(user);

    await expect(result).rejects.toThrowError(expected);
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  test('#CreateUserService should fail with invalid password', async () => {
    const userRepositoryMock = {
      create: jest.fn(),
    };

    const createUserService = new CreateUserService({
      userRepository: userRepositoryMock,
    });

    const user = UserObjectMother.withInvalidPassword();

    const expected = new UserError('Senha invalida!');

    const result = createUserService.execute(user);

    await expect(result).rejects.toThrowError(expected);
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  test('#CreateUserService should fail with if password and confirmedPassword does not match', async () => {
    const userRepositoryMock = {
      create: jest.fn(),
    };

    const createUserService = new CreateUserService({
      userRepository: userRepositoryMock,
    });

    const user = UserObjectMother.withInvalidConfirmPassword();

    const expected = new UserError('Senhas não coincidem!');

    const result = createUserService.execute(user);

    await expect(result).rejects.toThrowError(expected);
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  test('#CreateUserService should fail if user already exists', async () => {
    const userRepositoryMock = {
      create: jest.fn(),
      findByEmail: jest.fn().mockReturnValue(UserObjectMother.valid()),
    };

    const createUserService = new CreateUserService({
      userRepository: userRepositoryMock,
    });

    const expectedError = new UserError('Usuário já existe!');

    const user = UserObjectMother.valid();

    const result = createUserService.execute(user);

    await expect(result).rejects.toThrowError(expectedError);
    expect(userRepositoryMock.findByEmail).toHaveBeenCalled();
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  test('#CreateUserService should pass with valid user', async () => {
    const userRepositoryMock = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    const createUserService = new CreateUserService({
      userRepository: userRepositoryMock,
    });

    const user = UserObjectMother.valid();

    await createUserService.execute(user);

    expect(userRepositoryMock.create).toHaveBeenCalled();
    expect(userRepositoryMock.findByEmail).toHaveBeenCalled();
  });
});
