import { Task } from '../../../src/entities/task.mjs';

export class TaskDataBuilder {
  constructor() {
    this.tarefaData = {
      name: 'Primeiro Login',
      description: 'Está é uma tarefa criada por padrão pelo sistema.',
      priority: 0,
      deadline: new Date(),
      done: true,
    };
  }

  static validTask() {
    return new TaskDataBuilder().build();
  }

  build() {
    return new Task(this.tarefaData);
  }
}
