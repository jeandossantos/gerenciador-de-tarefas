import { jest, test, describe, expect, beforeEach } from '@jest/globals';

import { TaskError } from '../../../../src/errors/taskError.mjs';
import { TaskObjectMother } from '../../../model/task/taskObjectMother.mjs';
import { CreateTaskService } from '../../../../src/service/task/createTaskService.mjs';

describe('#CreateTaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should not create a task with invalid name', async () => {
    const task = TaskObjectMother.withInvalidName();

    const taskRepositoryMock = {
      create: jest.fn(),
    };

    const createTaskService = new CreateTaskService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('Nome invalido!');
    const result = createTaskService.execute(task);

    await expect(result).rejects.toThrowError(expectedError);
  });

  test('should not create a task with invalid owner id', async () => {
    const task = TaskObjectMother.withInvalidUserId();

    const taskRepositoryMock = {
      create: jest.fn(),
    };

    const createTaskService = new CreateTaskService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('ID do usuário invalido!');
    const result = createTaskService.execute(task);

    await expect(result).rejects.toThrowError(expectedError);
  });

  test('should create a task with without description', async () => {
    const task = TaskObjectMother.withoutDescription();

    const taskRepositoryMock = {
      create: jest.fn(),
    };

    const createTaskService = new CreateTaskService({
      taskRepository: taskRepositoryMock,
    });

    await createTaskService.execute(task);

    expect(taskRepositoryMock.create).toHaveBeenCalled();
  });

  test('should create a task with without priority', async () => {
    const task = TaskObjectMother.withoutPriority();

    const taskRepositoryMock = {
      create: jest.fn(),
    };

    const createTaskService = new CreateTaskService({
      taskRepository: taskRepositoryMock,
    });

    await createTaskService.execute(task);

    expect(taskRepositoryMock.create).toHaveBeenCalled();
  });

  test('should create a task with without done', async () => {
    const task = TaskObjectMother.withoutDone();

    const taskRepositoryMock = {
      create: jest.fn(),
    };

    const createTaskService = new CreateTaskService({
      taskRepository: taskRepositoryMock,
    });

    await createTaskService.execute(task);

    expect(taskRepositoryMock.create).toHaveBeenCalled();
  });

  test('should create a task with without deadline', async () => {
    const task = TaskObjectMother.withoutDeadline();

    const taskRepositoryMock = {
      create: jest.fn(),
    };

    const createTaskService = new CreateTaskService({
      taskRepository: taskRepositoryMock,
    });

    await createTaskService.execute(task);

    expect(taskRepositoryMock.create).toHaveBeenCalled();
  });
});
