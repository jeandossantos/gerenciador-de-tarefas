import { TaskError } from '../../errors/taskError.mjs';

import { existsOrError } from '../../validation.mjs';

function updateTaskServiceValidator(task) {
  existsOrError(task.name, 'Nome invalido!', TaskError);
}

export class UpdateTaskService {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({ id, name, description, priority, done, deadline }) {
    updateTaskServiceValidator({ name });

    await this.taskRepository.update({
      id,
      name,
      description,
      priority,
      deadline,
      done,
    });
  }
}
