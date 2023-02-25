import { Router } from 'express';
import {
  createUserController,
  authenticateUserController,
  validateUserTokenController,
  removeUserController,
  updateUserPasswordController,
  updateUserController,
  createTaskController,
  markAsDoneController,
  removeTaskController,
  findTaskStatsController,
  findTasksController,
  updateTaskController,
  findDailyTasksController,
} from './controller/index.mjs';

import { ensureAuthenticated } from './middleware/ensureAuthenticated.mjs';
import { Util } from './utils/util.mjs';
const routes = Router();

routes.post('/signin', (req, res) => {
  return authenticateUserController.handle(req, res);
});
routes.post('/signup', (req, res) => {
  return createUserController.handle(req, res);
});
routes.post('/validatetoken', (req, res) => {
  return validateUserTokenController.handle(req, res);
});

routes.delete('/users/:id', ensureAuthenticated, (req, res) => {
  return removeUserController.handle(req, res);
});

routes.put('/users/:id', ensureAuthenticated, (req, res) => {
  return updateUserController.handle(req, res);
});
routes.put('/users/update/:id', ensureAuthenticated, (req, res) => {
  return updateUserPasswordController.handle(req, res);
});

routes.post('/tasks', ensureAuthenticated, (req, res) => {
  return createTaskController.handle(req, res);
});

routes.get('/tasks', ensureAuthenticated, (req, res) => {
  return findTasksController.handle(req, res);
});

routes.get('/tasks/daily', ensureAuthenticated, (req, res) => {
  return findDailyTasksController.handle(req, res);
});

routes.put('/tasks/:id', ensureAuthenticated, (req, res) => {
  return updateTaskController.handle(req, res);
});

routes.delete('/tasks/:id', ensureAuthenticated, (req, res) => {
  return removeTaskController.handle(req, res);
});

routes.post('/tasks/finish/:id', ensureAuthenticated, (req, res) => {
  return markAsDoneController.handle(req, res);
});

routes.get('/stats', ensureAuthenticated, (req, res) => {
  return findTaskStatsController.handle(req, res);
});

export { routes };
