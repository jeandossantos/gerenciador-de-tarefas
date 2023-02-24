import { Router } from 'express';
import {
  createUserController,
  authenticateUserController,
  validateUserTokenController,
  removeUserController,
  updateUserPasswordController,
  updateUserController,
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
  res.status(Util.STATUS_CODES.Not_Implemented).send('Not_implemented');
});
routes.get('/tasks', ensureAuthenticated, (req, res) => {
  res.status(Util.STATUS_CODES.Not_Implemented).send('Not_implemented');
});

routes.get('/tasks/daily', ensureAuthenticated, (req, res) => {
  res.status(Util.STATUS_CODES.Not_Implemented).send('Not_implemented');
});

routes.put('/tasks/:id', ensureAuthenticated, (req, res) => {
  res.status(Util.STATUS_CODES.Not_Implemented).send('Not_implemented');
});
routes.delete('/tasks/:id', ensureAuthenticated, (req, res) => {
  res.status(Util.STATUS_CODES.Not_Implemented).send('Not_implemented');
});

routes.post('/tasks/finish/:id', ensureAuthenticated, (req, res) => {
  res.status(Util.STATUS_CODES.Not_Implemented).send('Not_implemented');
});

routes.get('/stats', ensureAuthenticated, (req, res) => {
  res.status(Util.STATUS_CODES.Not_Implemented).send('Not_implemented');
});

export { routes };
