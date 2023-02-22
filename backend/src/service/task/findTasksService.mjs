import { TaskError } from '../../errors/taskError.mjs';

function findTasksServiceValidation(task) {
  if (isNaN(task.page)) throw new TaskError('Page deve ser um número!');

  if (isNaN(task.limit)) throw new TaskError('Limit deve ser um número!');

  if (isNaN(task.userId)) throw new TaskError('ID do usuário invalido!');
}

export class FindTasksService {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({ userId, search, page, limit }) {
    findTasksServiceValidation({ userId, page, limit });

    const {
      tasks,
      limit: limitByPage,
      count,
    } = await this.taskRepository.findByUser({
      search,
      page,
      limit,
      userId,
    });

    const data = tasks.sort(this.sortTasks);

    return { data, limit: limitByPage, count };
  }

  sortTasks(a, b) {
    if (a.done > b.done) return 1;
    if (a.done < b.done) return -1;

    return 0;
  }
}
