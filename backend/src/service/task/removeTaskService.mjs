import { TaskError } from '../../errors/taskError.mjs';
import { existsOrError } from '../../validation.mjs';

function removeTaskServiceValidation(taskId) {
  existsOrError(taskId, 'Formato do ID invalido!', TaskError);

  if (isNaN(taskId)) throw new TaskError('Formato do ID invalido!');
}

export class RemoveTaskService {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({ id }) {
    removeTaskServiceValidation(id);

    await this.taskRepository.remove(id);
  }
}
