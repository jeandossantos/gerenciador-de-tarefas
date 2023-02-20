import bcrypt from 'bcrypt';

import { UserError } from '../../errors/userError.mjs';
import { equalsOrError } from '../../validation.mjs';
import { Util } from '../../utils/util.mjs';

function updateUserPasswordServiceValidation(user) {
  if (user.oldPassword.length <= 5) {
    throw new UserError('Senha do usuário incorreta!');
  }

  if (user.newPassword.length <= 5) {
    throw new UserError('Nova senha invalida!');
  }

  equalsOrError(
    user.newPassword,
    user.confirmNewPassword,
    'Senhas não coincidem!',
    UserError
  );
}

export class UpdateUserPasswordService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ id, oldPassword, newPassword, confirmNewPassword }) {
    updateUserPasswordServiceValidation({
      oldPassword,
      newPassword,
      confirmNewPassword,
    });

    const user = await this.userRepository.findById(id);

    const isMatch = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatch) throw new UserError('Senha do usuário incorreta!');

    const password = Util.encryptPassword(newPassword);

    await this.userRepository.updatePassword({ id, newPassword: password });
  }
}
