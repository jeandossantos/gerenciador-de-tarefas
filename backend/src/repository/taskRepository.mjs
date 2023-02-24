import { connection as knex } from '../database/knex.mjs';

import { BaseTaskRepository } from './base/baseTaskRepository.mjs';

export class TaskRepository extends BaseTaskRepository {
  async create(task) {
    return await knex('tasks').insert(task);
  }

  //   async remove(user) {
  //     throw new NotImplementedError(this.remove.name);
  //   }

  //   async find({ search, page, limit, userId }) {
  //     throw new NotImplementedError(this.find.name);
  //   }

  //   async findByUser({ search, page, limit, userId }) {
  //     throw new NotImplementedError(this.findByUser.name);
  //   }

  //   async getStats(userId) {
  //     throw new NotImplementedError(this.findByUser.name);
  //   }

  //   async markAsDone(userId) {
  //     throw new NotImplementedError(this.findByUser.name);
  //   }
}