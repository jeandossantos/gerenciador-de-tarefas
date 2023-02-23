import { Router } from 'express';
import {
  createUserController,
  authenticateUserController,
  validateUserTokenController,
} from './controller/index.mjs';

import { ensureAuthenticated } from './middleware/ensureAuthenticated.mjs';
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

routes.delete('/users/:id', ensureAuthenticated, (req, res) => {});
routes.put('/users/:id', ensureAuthenticated, (req, res) => {});
routes.put('/users/update/:id', ensureAuthenticated, (req, res) => {});

routes.post('/tasks', ensureAuthenticated, (req, res) => {});
routes.get('/tasks', ensureAuthenticated, (req, res) => {});

routes.get('/tasks/daily', ensureAuthenticated, (req, res) => {});

routes.put('/tasks/:id', ensureAuthenticated, (req, res) => {});
routes.delete('/tasks/:id', ensureAuthenticated, (req, res) => {});

routes.post('/tasks/finish/:id', ensureAuthenticated, (req, res) => {});

routes.get('/stats', ensureAuthenticated, (req, res) => {});

export { routes };
