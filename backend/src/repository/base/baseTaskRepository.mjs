import { NotImplementedError } from '../../errors/notImplementedError.mjs';

export class BaseTaskRepository {
  async create(user) {
    throw new NotImplementedError(this.create.name);
  }

  async update(user) {
    throw new NotImplementedError(this.update.name);
  }

  async remove(user) {
    throw new NotImplementedError(this.remove.name);
  }

  async findByUser({ search, page, limit, userId }) {
    throw new NotImplementedError(this.findByUser.name);
  }

  async getStats(userId) {
    throw new NotImplementedError(this.getStats.name);
  }

  async getDailyTasks({ search, page, limit, userId }) {
    throw new NotImplementedError(this.getDailyTasks.name);
  }

  async markAsDone(userId) {
    throw new NotImplementedError(this.markAsDone.name);
  }
}
