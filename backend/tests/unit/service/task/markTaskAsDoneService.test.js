import { jest, test, describe, expect, beforeEach } from '@jest/globals';

import { TaskError } from '../../../../src/errors/taskError.mjs';
import { TaskObjectMother } from '../../../model/task/taskObjectMother.mjs';
import { MarkTaskAsDoneService } from '../../../../src/service/task/markTaskAsDoneService.mjs';

describe('#MarkTaskAsDoneService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should not mark task as done with invalid task id', async () => {
    const { id: invalidId } = TaskObjectMother.withInvalidId();

    const taskRepositoryMock = {
      markAsDone: jest.fn(),
    };

    const markTaskAsDoneService = new MarkTaskAsDoneService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('ID da tarefa invalido!');
    const result = markTaskAsDoneService.execute({ invalidId });

    await expect(result).rejects.toThrowError(expectedError);
    expect(taskRepositoryMock.markAsDone).not.toHaveBeenCalled();
  });

  test('should mark task as done with valid task id', async () => {
    const { id } = TaskObjectMother.valid();

    const taskRepositoryMock = {
      markAsDone: jest.fn(),
    };

    const markTaskAsDoneService = new MarkTaskAsDoneService({
      taskRepository: taskRepositoryMock,
    });

    await markTaskAsDoneService.execute({ id });

    expect(taskRepositoryMock.markAsDone).toHaveBeenCalled();
  });
});
