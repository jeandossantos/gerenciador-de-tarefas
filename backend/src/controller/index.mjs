import { CreateUserController } from './user/createUserController.mjs';
import { CreateUserService } from '../service/user/createUserService.mjs';
import { UserRepository } from '../repository/userRepository.mjs';
import { AuthenticateUserService } from '../service/auth/authenticateUserService.mjs';
import { AuthenticateUserController } from './auth/authenticateUserController.mjs';

const userRepository = new UserRepository();

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

export { createUserController, authenticateUserController };
