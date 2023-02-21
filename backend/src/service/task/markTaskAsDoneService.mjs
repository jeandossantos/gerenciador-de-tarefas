import { TaskError } from '../../errors/taskError.mjs';

function markTaskAsDoneServiceValidation(task) {
  if (isNaN(task.id)) throw new TaskError('ID da tarefa invalido!');
}

export class MarkTaskAsDoneService {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({ id }) {
    markTaskAsDoneServiceValidation({ id });

    await this.taskRepository.markAsDone({ id });
  }
}
