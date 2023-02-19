export class Task {
  constructor({
    name,
    description = undefined,
    priority = 0,
    deadline,
    done = false,
  }) {
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.priority = this.priority;
    this.deadline = deadline;
    this.done = done;
  }
}
