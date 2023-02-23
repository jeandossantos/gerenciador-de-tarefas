import { CreateUserController } from './user/createUserController.mjs';
import { CreateUserService } from '../service/user/createUserService.mjs';
import { UserRepository } from '../repository/userRepository.mjs';
import { AuthenticateUserService } from '../service/auth/authenticateUserService.mjs';
import { AuthenticateUserController } from './auth/authenticateUserController.mjs';
import { ValidateTokenService } from '../service/auth/validateTokenService.mjs';
import { ValidateUserTokenController } from './auth/validateUserTokenController.mjs';

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

const validateUserTokenService = new ValidateTokenService({
  userRepository,
});

const validateUserTokenController = new ValidateUserTokenController({
  validateTokenService: validateUserTokenService,
});

export {
  createUserController,
  authenticateUserController,
  validateUserTokenController,
};
