import { jest, test, describe, expect, beforeEach } from '@jest/globals';

import { TaskError } from '../../../../src/errors/taskError.mjs';
import { FindTasksService } from '../../../../src/service/task/findTasksService.mjs';

describe('#FindTasksService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('#SortTasks', () => {
    test('Unfinished tasks must come first', () => {
      const taskRepositoryMock = {
        findByUser: jest.fn(),
      };
      const findTasksService = new FindTasksService({
        taskRepository: taskRepositoryMock,
      });
      const tasks = [
        {
          id: 1,
          name: 'task 1',
          done: true,
        },
        {
          id: 2,
          name: 'task 2',
          done: false,
        },
        {
          id: 3,
          name: 'task 3',
          done: true,
        },
        {
          id: 4,
          name: 'task 4',
          done: false,
        },
      ];
      const result = tasks.sort(findTasksService.sortTasks);

      expect(result[0].done).toBe(false);
      expect(result[1].done).toBe(false);
      expect(result[2].done).toBe(true);
      expect(result[3].done).toBe(true);
    });
  });

  test('should not find tasks with invalid owner id', async () => {
    const findTasksArgs = {
      page: 1,
      limit: 1,
      search: '',
      userId: 'invalid-userId',
    };

    const taskRepositoryMock = {
      findByUser: jest.fn(),
    };

    const findTasksService = new FindTasksService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('ID do usuário invalido!');

    const result = findTasksService.execute(findTasksArgs);

    await expect(result).rejects.toThrowError(expectedError);
    expect(taskRepositoryMock.findByUser).not.toHaveBeenCalled();
  });

  test('should not find tasks with invalid page', async () => {
    const findTasksArgs = {
      page: 'invalid-page',
      limit: 1,
      search: '',
      userId: 100,
    };

    const taskRepositoryMock = {
      findByUser: jest.fn(),
    };

    const findTasksService = new FindTasksService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('Page deve ser um número!');

    const result = findTasksService.execute(findTasksArgs);

    await expect(result).rejects.toThrowError(expectedError);
    expect(taskRepositoryMock.findByUser).not.toHaveBeenCalled();
  });

  test('should not find tasks with invalid limit', async () => {
    const findTasksArgs = {
      page: 1,
      limit: 'invalid-limit',
      search: '',
      userId: 100,
    };

    const taskRepositoryMock = {
      findByUser: jest.fn(),
    };

    const findTasksService = new FindTasksService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('Limit deve ser um número!');

    const result = findTasksService.execute(findTasksArgs);

    await expect(result).rejects.toThrowError(expectedError);
    expect(taskRepositoryMock.findByUser).not.toHaveBeenCalled();
  });

  test('should find tasks', async () => {
    const findTasksArgs = {
      page: 1,
      limit: 1,
      search: '',
      userId: 100,
    };

    const taskRepositoryMock = {
      findByUser: jest.fn().mockResolvedValue({
        tasks: [],
        limit: 1,
        count: 10,
      }),
    };

    const findTasksService = new FindTasksService({
      taskRepository: taskRepositoryMock,
    });

    const result = await findTasksService.execute(findTasksArgs);

    expect(taskRepositoryMock.findByUser).toHaveBeenCalled();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('limit');
    expect(result).toHaveProperty('count');
  });
});
