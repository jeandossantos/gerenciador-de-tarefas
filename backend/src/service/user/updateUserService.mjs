import { UserError } from '../errors/userError.mjs';
import { existsOrError } from '../validation.mjs';

export function updateUserServiceValidation(user) {
  if (isNaN(user.id)) {
    throw new UserError('Não encontrado!');
  }

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
}

export class UpdateUserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ id, name, initials, email }) {
    updateUserServiceValidation({ id, name, initials, email });

    await this.userRepository.update({
      id,
      name,
      initials,
      email,
    });
  }
}
