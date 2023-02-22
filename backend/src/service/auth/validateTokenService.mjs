import jwt from 'jsonwebtoken';

export class ValidateTokenService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(token) {
    try {
      const payload = jwt.verify(token, process.env.SECRET_OR_KEY);

      const user = await this.userRepository.findById(payload.id);

      if (!user) return false;

      return true;
    } catch (error) {
      return false;
    }
  }
}
