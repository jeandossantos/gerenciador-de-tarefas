import { connection as knex } from '../database/knex.mjs';
import { NotImplementedError } from '../errors/notImplementedError.mjs';

class AbstractUserRepository {
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

export class UserRepository extends AbstractUserRepository {
  async findByEmail(email) {
    return await knex('users').where({ email }).first();
  }
}
