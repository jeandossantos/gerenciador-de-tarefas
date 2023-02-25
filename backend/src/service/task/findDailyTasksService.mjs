import { TaskError } from '../../errors/taskError.mjs';

function findDailyTasksServiceValidator(task) {
  if (isNaN(task.page)) throw new TaskError('Page deve ser um número!');

  if (isNaN(task.limit)) throw new TaskError('Limit deve ser um número!');

  if (isNaN(task.userId)) throw new TaskError('ID do usuário invalido!');
}

export class FindDailyTasksService {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({ userId, search, page, limit }) {
    findDailyTasksServiceValidator({ userId, page, limit });

    const { tasks, count } = await this.taskRepository.getDailyTasks({
      search,
      page,
      limit,
      userId,
    });

    const data = tasks.sort(this.sortTasks);

    return { data, limit, count };
  }

  sortTasks(a, b) {
    if (a.done > b.done) return 1;
    if (a.done < b.done) return -1;

    return 0;
  }
}
