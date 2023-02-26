import { TaskError } from '../../errors/taskError.mjs';
import { existsOrError } from '../../validation.mjs';

function createTaskServiceValidation(task) {
  existsOrError(task.name, 'Nome invalido!', TaskError);
  existsOrError(task.userId, 'ID do usuário invalido!', TaskError);

  if (isNaN(task.userId)) throw new TaskError('ID do usuário invalido!');
}

export class CreateTaskService {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }

  async execute({ name, description, priority, done, deadline, userId }) {
    createTaskServiceValidation({ name, userId });

    await this.taskRepository.create({
      name,
      description,
      priority,
      deadline,
      done,
      userId,
    });
  }
}
