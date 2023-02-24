import { NotImplementedError } from '../../errors/notImplementedError.mjs';

export class BaseUserRepository {
  async create(user) {
    throw new NotImplementedError(this.create.name);
  }

  async findById(id) {
    throw new NotImplementedError(this.findById.name);
  }

  async findByEmail(email) {
    throw new NotImplementedError(this.findByEmail.name);
  }

  async remove(id) {
    throw new NotImplementedError(this.remove.name);
  }

  async updatePassword({ newPassword, id }) {
    throw new NotImplementedError(this.updatePassword.name);
  }
}
