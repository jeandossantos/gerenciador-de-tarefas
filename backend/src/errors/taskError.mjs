import { BaseError } from './base/baseError.mjs';

export class TaskError extends BaseError {
  constructor(message) {
    super(message);
  }
}
