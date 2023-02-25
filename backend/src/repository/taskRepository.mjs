import { connection as knex } from '../database/knex.mjs';

import { BaseTaskRepository } from './base/baseTaskRepository.mjs';

export class TaskRepository extends BaseTaskRepository {
  async create(task) {
    return await knex('tasks').insert(task);
  }

  async remove(id) {
    return await knex('tasks').where({ id }).del();
  }

  async findByUser({ search, page, limit, userId }) {
    const count = await knex('tasks')
      .where({ userId })
      .whereRaw('LOWER(name) LIKE ?', `${search.toLowerCase()}%`)
      .count('id', { as: 'value' })
      .first();

    const tasks = await knex('tasks')
      .where({ userId })
      .whereRaw('LOWER(name) LIKE ?', `${search.toLowerCase()}%`)
      .limit(limit)
      .offset(page * limit - limit)
      .orderBy('deadline', 'DESC');

    return { tasks, count: count.value };
  }

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
