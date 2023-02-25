import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { NotImplementedError } from '../../../src/errors/notImplementedError.mjs';

import { BaseTaskRepository } from '../../../src/repository/base/baseTaskRepository.mjs';

describe('Not implemented Error class - BaseTaskRepository', () => {
  test('should throw an error method create is not implemented', async () => {
    class ConcreteClass extends BaseTaskRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(concreteClass.create.name);

    await expect(() => concreteClass.create({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method findByUser is not implemented', async () => {
    class ConcreteClass extends BaseTaskRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(
      concreteClass.findByUser.name
    );

    await expect(() => concreteClass.findByUser({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method remove is not implemented', async () => {
    class ConcreteClass extends BaseTaskRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(concreteClass.remove.name);

    await expect(() => concreteClass.remove({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method getStats is not implemented', async () => {
    class ConcreteClass extends BaseTaskRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(concreteClass.getStats.name);

    await expect(() => concreteClass.getStats({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method update is not implemented', async () => {
    class ConcreteClass extends BaseTaskRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(concreteClass.update.name);

    await expect(() => concreteClass.update({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method markAsDone is not implemented', async () => {
    class ConcreteClass extends BaseTaskRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(
      concreteClass.markAsDone.name
    );

    await expect(() => concreteClass.markAsDone({})).rejects.toThrowError(
      expectedError
    );
  });

  test('should throw an error method getDailyTasks is not implemented', async () => {
    class ConcreteClass extends BaseTaskRepository {}

    const concreteClass = new ConcreteClass();

    const expectedError = new NotImplementedError(
      concreteClass.getDailyTasks.name
    );

    await expect(() => concreteClass.getDailyTasks({})).rejects.toThrowError(
      expectedError
    );
  });
});
