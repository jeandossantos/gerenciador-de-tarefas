import { BaseError } from './base/baseError.mjs';

export class AuthError extends BaseError {
  constructor(message) {
    super(message);
  }
}
