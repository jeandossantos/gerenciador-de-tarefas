import { CreateUserController } from './user/createUserController.mjs';
import { CreateUserService } from '../service/user/createUserService.mjs';
import { UserRepository } from '../repository/userRepository.mjs';
import { AuthenticateUserService } from '../service/auth/authenticateUserService.mjs';
import { AuthenticateUserController } from './auth/authenticateUserController.mjs';
import { ValidateTokenService } from '../service/auth/validateTokenService.mjs';
import { ValidateUserTokenController } from './auth/validateUserTokenController.mjs';
import { RemoveUserController } from './user/removeUserController.mjs';
import { RemoveUserService } from '../service/user/removeUserService.mjs';
import { UpdateUserPasswordController } from './user/updateUserPasswordController.mjs';
import { UpdateUserPasswordService } from '../service/user/updateUserPasswordService.mjs';
import { UpdateUserService } from '../service/user/updateUserService.mjs';
import { UpdateUserController } from '../controller/user/UpdateUserController.mjs';
import { TaskRepository } from '../repository/taskRepository.mjs';
import { CreateTaskService } from '../service/task/createTaskService.mjs';
import { CreateTaskController } from './task/createTaskController.mjs';
import { MarkAsDoneController } from './task/markTaskAsDoneController.mjs';
import { MarkTaskAsDoneService } from '../service/task/markTaskAsDoneService.mjs';
import { RemoveTaskService } from '../service/task/removeTaskService.mjs';
import { RemoveTaskController } from '../controller/task/removeTaskController.mjs';

const userRepository = new UserRepository();
const taskRepository = new TaskRepository();

const createUserService = new CreateUserService({
  userRepository,
});
const createUserController = new CreateUserController({
  createUserService,
});

const authenticateUserService = new AuthenticateUserService({
  userRepository,
});

const authenticateUserController = new AuthenticateUserController({
  authenticateUserService,
});

const validateUserTokenService = new ValidateTokenService({
  userRepository,
});

const validateUserTokenController = new ValidateUserTokenController({
  validateTokenService: validateUserTokenService,
});

const removeUserService = new RemoveUserService({
  userRepository,
});

const removeUserController = new RemoveUserController({
  removeUserService,
});

const updateUserPasswordService = new UpdateUserPasswordService({
  userRepository,
});

const updateUserPasswordController = new UpdateUserPasswordController({
  updateUserPasswordService,
});

const updateUserService = new UpdateUserService({
  userRepository,
});

const updateUserController = new UpdateUserController({
  updateUserService,
});

const createTaskService = new CreateTaskService({
  taskRepository,
});

const createTaskController = new CreateTaskController({
  createTaskService,
});

const markTaskAsDoneService = new MarkTaskAsDoneService({
  taskRepository,
});
const markAsDoneController = new MarkAsDoneController({
  markAsDoneService: markTaskAsDoneService,
});

const removeTaskService = new RemoveTaskService({
  taskRepository,
});
const removeTaskController = new RemoveTaskController({
  removeTaskService,
});

export {
  createUserController,
  authenticateUserController,
  validateUserTokenController,
  removeUserController,
  updateUserPasswordController,
  updateUserController,
  createTaskController,
  markAsDoneController,
  removeTaskController,
};
