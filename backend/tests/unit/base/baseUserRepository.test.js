import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { NotImplementedError } from '../../../src/errors/notImplementedError.mjs';

import { BaseUserRepository } from '../../../src/repository/base/baseUserRepository.mjs';

describe('Not implemented Error class', () => {
  test('should throw an error method create is not implemented', async () => {
    class ConcreteClass extends BaseUserRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(concreteClass.create.name);

    await expect(() => concreteClass.create({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method findById is not implemented', async () => {
    class ConcreteClass extends BaseUserRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(concreteClass.findById.name);

    await expect(() => concreteClass.findById({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method findByEmail is not implemented', async () => {
    class ConcreteClass extends BaseUserRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(
      concreteClass.findByEmail.name
    );

    await expect(() => concreteClass.findByEmail({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method remove is not implemented', async () => {
    class ConcreteClass extends BaseUserRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(concreteClass.remove.name);

    await expect(() => concreteClass.remove({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method updatePassword is not implemented', async () => {
    class ConcreteClass extends BaseUserRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(
      concreteClass.updatePassword.name
    );

    await expect(() => concreteClass.updatePassword({})).rejects.toThrowError(
      expectedError
    );
  });
});
