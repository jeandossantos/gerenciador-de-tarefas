import { prisma } from '../database/prisma.mjs';
import { BaseTaskRepository } from './base/baseTaskRepository.mjs';

export class TaskRepository extends BaseTaskRepository {
  constructor() {
    super();

    this.connection = prisma.tasks;
  }
  async create(task) {
    return await this.connection.create({
      data: task,
    });
  }

  async remove(id) {
    return await this.connection.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async update({ id, ...task }) {
    await this.connection.update({
      where: {
        id: Number(id),
      },
      data: {
        ...task,
      },
    });
  }

  async getDailyTasks({ search, page, limit, userId }) {
    const currentDate = new Date();

    const [day, month, year] = [
      currentDate.getDate(),
      currentDate.getMonth(),
      currentDate.getFullYear(),
    ];

    const yesterdayDate = `${year}-${month + 1}-${day - 1}`;
    const tomorrowDate = `${year}-${month + 1}-${day + 1}`;

    const count = await this.connection.count({
      where: {
        userId: Number(userId),
        deadline: {
          lt: new Date(tomorrowDate),
          gt: new Date(yesterdayDate),
        },
        name: {
          startsWith: search,
        },
      },
    });

    const tasks = await this.connection.findMany({
      where: {
        userId: Number(userId),
        deadline: {
          lt: new Date(tomorrowDate),
          gt: new Date(yesterdayDate),
        },
        name: {
          startsWith: search,
        },
      },
      orderBy: {
        deadline: 'desc',
      },
      take: limit,
      skip: page * limit - limit,
    });

    return { tasks, count };
  }

  async findByUser({ search, page, limit, userId }) {
    const count = await this.connection.count({
      where: {
        userId: Number(userId),
        name: {
          startsWith: search,
        },
      },
    });

    const tasks = await this.connection.findMany({
      where: {
        userId: Number(userId),
        name: {
          startsWith: search,
        },
      },
      orderBy: {
        deadline: 'desc',
      },
      take: limit,
      skip: page * limit - limit,
    });

    return { tasks, count };
  }

  async getStats(userId) {
    const date = new Date().getTime();

    const tasks = await this.connection.findMany({
      where: {
        userId: Number(userId),
      },
    });

    const expiredTasksCount = tasks.filter(
      (task) => new Date(task.deadline).getTime() < date
    );

    const finishedTasksCount = tasks.filter((task) => task.done);

    const totalTasksCount = await this.connection.count({
      where: {
        userId: Number(userId),
      },
    });

    return {
      finishedTasksCount: finishedTasksCount.length,
      totaltasksCount: totalTasksCount,
      expiredTasksCount: Number(expiredTasksCount.length),
    };
  }

  async markAsDone({ id: taskId }) {
    await this.connection.update({
      where: {
        id: Number(taskId),
      },
      data: { done: true },
    });
  }
}
