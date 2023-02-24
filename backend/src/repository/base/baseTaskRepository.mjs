import { NotImplementedError } from '../../errors/notImplementedError.mjs';

export class BaseTaskRepository {
  async create(user) {
    throw new NotImplementedError(this.create.name);
  }

  async remove(user) {
    throw new NotImplementedError(this.remove.name);
  }

  async find({ search, page, limit, userId }) {
    throw new NotImplementedError(this.find.name);
  }

  async findByUser({ search, page, limit, userId }) {
    throw new NotImplementedError(this.findByUser.name);
  }

  async getStats(userId) {
    throw new NotImplementedError(this.findByUser.name);
  }

  async markAsDone(userId) {
    throw new NotImplementedError(this.findByUser.name);
  }
}
