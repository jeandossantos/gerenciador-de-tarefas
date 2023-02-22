import {
  jest,
  test,
  describe,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';

import { TaskError } from '../../../../src/errors/taskError.mjs';
import { TaskObjectMother } from '../../../model/task/taskObjectMother.mjs';
import { FindTaskStatsService } from '../../../../src/service/task/findTaskStatsService.mjs';

describe('#FindTasksStatsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => jest.restoreAllMocks());

  test('should not find stats with invalid owner id', async () => {
    const { userId: ownerId } = TaskObjectMother.withInvalidUserId();

    const taskRepositoryMock = {
      getStats: jest.fn(),
    };

    const findTaskStatsService = new FindTaskStatsService({
      taskRepository: taskRepositoryMock,
    });

    const expectedError = new TaskError('ID do usuário invalido!');

    await expect(findTaskStatsService.execute(ownerId)).rejects.toThrowError(
      expectedError
    );

    expect(taskRepositoryMock.getStats).not.toHaveBeenCalled();
  });

  test('should find stats with valid owner id', async () => {
    const { userId: ownerId } = TaskObjectMother.valid();

    const taskRepositoryMock = {
      getStats: jest.fn().mockResolvedValue(),
    };

    const findTaskStatsService = new FindTaskStatsService({
      taskRepository: taskRepositoryMock,
    });

    const result = await findTaskStatsService.execute(ownerId);

    expect(taskRepositoryMock.getStats).toHaveBeenCalled();
  });
});
