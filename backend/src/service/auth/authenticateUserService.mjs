import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AuthError } from '../../errors/authError.mjs';

function authenticateUserValidator(auth) {
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(auth.email)) {
    throw new AuthError('Informe E-mail e senha!');
  }

  if (auth.password.length <= 5) {
    throw new AuthError('Usuário/Senha inválidos!');
  }
}

export class AuthenticateUserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    authenticateUserValidator({ email, password });

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AuthError('Usuário não encontrado!');

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) throw new AuthError('Usuário/Senha inválidos!');

    const payload = {
      id: user.id,
      name: user.name,
      initiais: user.initials,
      email: user.email,
    };

    return {
      ...payload,
      token: jwt.sign({ id: user.id }, process.env.SECRET_OR_KEY),
    };
  }
}
