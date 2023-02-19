import { TaskDataBuilder } from './taskDataBuilder.mjs';

export class TaskObjectMother {
  static valid() {
    return TaskDataBuilder.validTask();
  }
}
