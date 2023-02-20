import { TaskDataBuilder } from './taskDataBuilder.mjs';

export class TaskObjectMother {
  static valid() {
    return TaskDataBuilder.validTask().build();
  }

  static withInvalidName() {
    return TaskDataBuilder.validTask().withInvalidName().build();
  }

  static withInvalidUserId() {
    return TaskDataBuilder.validTask().withInvalidUserId().build();
  }

  static withoutDescription() {
    return TaskDataBuilder.validTask().withoutDescription().build();
  }

  static withoutPriority() {
    return TaskDataBuilder.validTask().withoutPriority().build();
  }

  static withoutDone() {
    return TaskDataBuilder.validTask().withoutDone().build();
  }

  static withoutDeadline() {
    return TaskDataBuilder.validTask().withoutDeadline().build();
  }
}
