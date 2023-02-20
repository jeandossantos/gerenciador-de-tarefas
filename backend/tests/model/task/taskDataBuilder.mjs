import { Task } from '../../../src/entities/task.mjs';

export class TaskDataBuilder {
  constructor() {
    this.tarefaData = {
      id: 1,
      name: 'Primeiro Login',
      description: 'Está é uma tarefa criada por padrão pelo sistema.',
      priority: 0,
      deadline: new Date(),
      done: false,
      userId: 123,
    };
  }

  static validTask() {
    return new TaskDataBuilder();
  }

  withInvalidId() {
    this.tarefaData.id = 'abc';

    return this;
  }

  withInvalidName() {
    this.tarefaData.name = '';

    return this;
  }

  withInvalidUserId() {
    this.tarefaData.userId = 'invalid-user-id';

    return this;
  }

  withoutDescription() {
    Reflect.deleteProperty(this.tarefaData, 'description');

    return this;
  }

  withoutPriority() {
    Reflect.deleteProperty(this.tarefaData, 'priority');

    return this;
  }

  withoutDone() {
    Reflect.deleteProperty(this.tarefaData, 'done');

    return this;
  }

  withoutDeadline() {
    Reflect.deleteProperty(this.tarefaData, 'deadline');

    return this;
  }

  build() {
    return new Task(this.tarefaData);
  }
}
