import { jest, test, describe, expect, beforeEach } from '@jest/globals';

import { TaskError } from '../../../../src/errors/taskError.mjs';
import { TaskObjectMother } from '../../../model/task/taskObjectMother.mjs';
import { CreateTaskService } from '../../../../src/service/task/createTaskService.mjs';
import { RemoveTaskService } from '../../../../src/service/task/removeTaskService.mjs';

describe('#CreateTaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should not remove a task with invalid task ID', async () => {
    const task = TaskObjectMother.withInvalidId();

    const taskRepositoryMock = {
      remove: jest.fn(),
    };

    const removeTaskService = new RemoveTaskService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('Formato do ID invalido!');

    const result = removeTaskService.execute({ id: task.id });

    await expect(result).rejects.toThrowError(expectedError);

    expect(taskRepositoryMock.remove).not.toHaveBeenCalled();
  });

  test('should remove a task with invalid task ID', async () => {
    const task = TaskObjectMother.valid();

    const taskRepositoryMock = {
      remove: jest.fn(),
    };

    const removeTaskService = new RemoveTaskService({
      taskRepository: taskRepositoryMock,
    });

    await removeTaskService.execute({ id: task.id });

    expect(taskRepositoryMock.remove).toHaveBeenCalled();
  });
});
