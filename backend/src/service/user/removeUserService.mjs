import bcrypt from 'bcrypt';

import { UserError } from '../../errors/userError.mjs';

export function removeUserServiceValidation(user) {
  if (isNaN(user.id)) {
    throw new UserError('Usuário não encontrado!');
  }

  if (user.password.length <= 5) {
    throw new UserError('Senha do usuário incorreta!');
  }
}

export class RemoveUserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ id, password }) {
    removeUserServiceValidation({ id, password });

    const user = await this.userRepository.findById(id);

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new UserError('Senha do usuário incorreta!');
    }

    await this.userRepository.remove({ id });
  }
}
