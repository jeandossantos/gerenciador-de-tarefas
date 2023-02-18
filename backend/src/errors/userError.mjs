import { BaseError } from './base/baseError.mjs';

export class UserError extends BaseError {
  constructor(message) {
    super(message);
  }
}
