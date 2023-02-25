import { jest, test, describe, expect, beforeEach } from '@jest/globals';

import { TaskError } from '../../../../src/errors/taskError.mjs';
import { FindDailyTasksService } from '../../../../src/service/task/findDailyTasksService.mjs';

describe('#FindDailyTasksService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  let numberOfDaysAdded = 0;
  const tasks = [
    {
      id: 1,
      name: 'task 1',
      done: true,
      deadline: new Date(),
    },
    {
      id: 2,
      name: 'task 2',
      done: false,
      deadline: new Date(),
    },
    {
      id: 3,
      name: 'task 3',
      done: true,
      deadline: new Date(),
    },
    {
      id: 4,
      name: 'task 4',
      done: false,
      deadline: new Date(),
    },
  ];

  describe('#SortTasks', () => {
    test('Unfinished tasks must come first', () => {
      const taskRepositoryMock = {
        getDailyTasks: jest.fn(),
      };

      const findDailyTasksService = new FindDailyTasksService({
        taskRepository: taskRepositoryMock,
      });

      const result = tasks.sort(findDailyTasksService.sortTasks);

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
      getDailyTasks: jest.fn(),
    };

    const findDailyTasksService = new FindDailyTasksService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('ID do usuário invalido!');

    const result = findDailyTasksService.execute(findTasksArgs);

    await expect(result).rejects.toThrowError(expectedError);
    expect(taskRepositoryMock.getDailyTasks).not.toHaveBeenCalled();
  });

  test('should not find tasks with invalid page', async () => {
    const findTasksArgs = {
      page: 'invalid-page',
      limit: 1,
      search: '',
      userId: 100,
    };

    const taskRepositoryMock = {
      getDailyTasks: jest.fn(),
    };

    const findDailyTasksService = new FindDailyTasksService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('Page deve ser um número!');

    const result = findDailyTasksService.execute(findTasksArgs);

    await expect(result).rejects.toThrowError(expectedError);
    expect(taskRepositoryMock.getDailyTasks).not.toHaveBeenCalled();
  });

  test('should not find tasks with invalid limit', async () => {
    const findTasksArgs = {
      page: 1,
      limit: 'invalid-limit',
      search: '',
      userId: 100,
    };

    const taskRepositoryMock = {
      getDailyTasks: jest.fn(),
    };

    const findDailyTasksService = new FindDailyTasksService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('Limit deve ser um número!');

    const result = findDailyTasksService.execute(findTasksArgs);

    await expect(result).rejects.toThrowError(expectedError);
    expect(taskRepositoryMock.getDailyTasks).not.toHaveBeenCalled();
  });

  test('should find tasks', async () => {
    const findTasksArgs = {
      page: 1,
      limit: 1,
      search: '',
      userId: 100,
    };

    const taskRepositoryMock = {
      getDailyTasks: jest.fn().mockResolvedValue({
        tasks,
        limit: 1,
        count: 10,
      }),
    };

    const findDailyTasksService = new FindDailyTasksService({
      taskRepository: taskRepositoryMock,
    });

    const result = await findDailyTasksService.execute(findTasksArgs);

    const deadlines = result.data.map((task) => {
      const date = new Date(task.deadline);

      return `${date.getDate()}-${date.getMonth()}`;
    });

    const currentDate = new Date();
    const expectedDate = `${currentDate.getDate()}-${currentDate.getMonth()}`;

    deadlines.forEach((deadline) => {
      console.log(deadline, expectedDate);
      expect(deadline).toBe(expectedDate);
    });

    expect(taskRepositoryMock.getDailyTasks).toHaveBeenCalled();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('limit');
    expect(result).toHaveProperty('count');
  });
});
