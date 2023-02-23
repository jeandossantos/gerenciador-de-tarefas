import { BaseError } from './base/baseError.mjs';

export class NotImplementedError extends BaseError {
  constructor(message) {
    super(`the method [${message}] is not implemented!`);
  }
}
