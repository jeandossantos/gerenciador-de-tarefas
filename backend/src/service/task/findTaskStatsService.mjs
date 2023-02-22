import { TaskError } from '../../errors/taskError.mjs';

function findTaskStatsServiceValidator(userId) {
  if (isNaN(userId)) throw new TaskError('ID do usuário invalido!');
}

export class FindTaskStatsService {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute(userId) {
    findTaskStatsServiceValidator(userId);

    const stats = await this.taskRepository.getStats(userId);

    return stats;
  }
}
