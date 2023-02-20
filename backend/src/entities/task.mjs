export class Task {
  constructor({
    id = undefined,
    name,
    description = undefined,
    priority = 0,
    deadline,
    done = false,
    userId = undefined,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.priority = this.priority;
    this.deadline = deadline;
    this.done = done;
    this.userId = userId;
  }
}
