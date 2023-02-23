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

  async create(user) {
    const tarefaDefault = {
      name: 'Primeiro Login',
      description: 'Está é uma tarefa criada por padrão pelo sistema.',
      priority: 0,
      deadline: new Date(),
      done: false,
    };

    await knex.transaction(async (trx) => {
      const id = await trx('users').insert(user, 'id');

      await trx('tasks').insert({ ...tarefaDefault, userId: id });
    });
  }

  async findById(id) {
    return await knex('users').where({ id }).first();
  }
}
