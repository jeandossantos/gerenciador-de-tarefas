import { connection as knex } from '../database/knex.mjs';
import { BaseUserRepository } from './base/baseUserRepository.mjs';

export class UserRepository extends BaseUserRepository {
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
      const [id] = await trx('users').insert(user, 'id');

      await trx('tasks').insert({ ...tarefaDefault, userId: id });
    });
  }

  async findById(id) {
    return await knex('users').where({ id }).first();
  }

  async remove(id) {
    return await knex('users').where({ id }).del();
  }

  async updatePassword({ id, newPassword }) {
    return await knex('users').update({ password: newPassword }).where({ id });
  }

  async update(user) {
    return await knex('users').update(user).where({ id: user.id });
  }
}
