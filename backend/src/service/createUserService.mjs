import { UserError } from '../errors/userError.mjs';
import { Util } from '../utils/util.mjs';
import {
  equalsOrError,
  existsOrError,
  notExistsOrError,
} from '../validation.mjs';

export function createUserServiceValidation(user) {
  existsOrError(user.name, 'Nome invalido!', UserError);

  if (/(\W |\d)/.test(user.name)) {
    throw new UserError('Nome invalido!');
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
    throw new UserError('E-mail invalido!');
  }

  if (user.initials.length !== 2 || /[\d|\W]/gi.test(user.initials)) {
    throw new UserError('Iniciais invalidas!');
  }

  if (user.password.length <= 5) {
    throw new UserError('Senha invalida!');
  }

  if (user.password !== user.confirmPassword) {
    throw new UserError('Senhas não coincidem!');
  }

  equalsOrError(
    user.password,
    user.confirmPassword,
    'Senhas não coincidem!',
    UserError
  );
}

export class CreateUserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ name, initials, email, password, confirmPassword }) {
    createUserServiceValidation({
      name,
      initials,
      email,
      password,
      confirmPassword,
    });

    const user = await this.userRepository.findByEmail(email);

    notExistsOrError(user, 'Usuário já existe!', UserError);

    const newPassword = Util.encryptPassword(password);

    await this.userRepository.create({
      name,
      initials,
      email,
      password: newPassword,
    });
  }
}
