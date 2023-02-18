import { jest, test, describe, expect, beforeEach } from '@jest/globals';

import {
  equalsOrError,
  existsOrError,
  notExistsOrError,
} from '../../src/validation.mjs';

describe('#Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('#existsOrError function', () => {
    test('should throw an error with an undefined value', () => {
      const value = undefined;

      expect(() => existsOrError(value, 'Invalid value', Error)).toThrow(
        new Error('Invalid value')
      );
    });

    test('should throw an error with an empty array', () => {
      const value = [];

      expect(() => existsOrError(value, 'Invalid value', Error)).toThrow(
        new Error('Invalid value')
      );
    });

    test('should throw an error with a empty string', () => {
      const value = '';

      expect(() => existsOrError(value, 'Invalid value', Error)).toThrow(
        new Error('Invalid value')
      );
    });
  });

  describe('#equalsOrError function', () => {
    test('', () => {
      const value1 = 'value1';
      const value2 = 'value2';

      expect(() =>
        equalsOrError(value1, value2, 'values does not match!', Error)
      ).toThrow(new Error('values does not match!'));
    });
  });

  describe('#notExistsOrError function', () => {
    test('should throw an error with truthy value', () => {
      const value1 = {};

      expect(() =>
        notExistsOrError(value1, 'this is not a falsy value!', Error)
      ).toThrow(new Error('this is not a falsy value!'));
    });
  });
});
