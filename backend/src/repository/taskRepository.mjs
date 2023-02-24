import { connection as knex } from '../database/knex.mjs';

import { BaseTaskRepository } from './base/baseTaskRepository.mjs';

export class TaskRepository extends BaseTaskRepository {
  async create(task) {
    return await knex('tasks').insert(task);
  }

  async remove(id) {
    return await knex('tasks').where({ id }).del();
  }

  //   async find({ search, page, limit, userId }) {
  //     throw new NotImplementedError(this.find.name);
  //   }

  //   async findByUser({ search, page, limit, userId }) {
  //     throw new NotImplementedError(this.findByUser.name);
  //   }

  async getStats(userId) {
    const date = new Date().getTime();

    const uncompletedTasks = await knex('tasks').where({
      userId,
      done: false,
    });

    const expiredTasksCount = uncompletedTasks.filter(
      (task) => new Date(task.deadline).getTime() < date
    );

    const finishedTasksCount = await knex('tasks')
      .where({ userId, done: true })
      .count('id', { as: 'count' })
      .first();

    const [totalTasksCount] = await knex('tasks')
      .where({ userId })
      .count('id', { as: 'count' });

    return {
      finishedTasksCount: finishedTasksCount.count,
      totaltasksCount: totalTasksCount.count,
      expiredTasksCount: Number(expiredTasksCount.length) || 0,
    };
  }

  async markAsDone({ id: taskId }) {
    await knex('tasks').update({ done: true }).where({ id: taskId });
  }
}
