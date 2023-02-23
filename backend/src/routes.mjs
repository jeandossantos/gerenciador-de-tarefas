import { Router } from 'express';
import { createUserController } from './controller/index.mjs';

const routes = Router();

routes.post('/signup', (req, res) => {
  return createUserController.handle(req, res);
});

export { routes };

// app.post('/signin', authApi.signin);
// app.post('/signup', userApi.save);
// app.post('/validatetoken', authApi.validateToken);

// app.route('/users/:id')
// .all(passport.authenticate())
// .delete(userApi.remove)
// .put(userApi.save)

// app.route('/users/update/:id')
//     .all(passport.authenticate())
//     .put(userApi.updatePassword)

// app.route('/tasks')
//     .all(passport.authenticate())
//     .post(taskApi.save)
//     .get(taskApi.getAll)

// app.route('/tasks/daily')
//     .all(passport.authenticate())
//     .get(taskApi.getDialyTasks)

// app.route('/tasks/:id')
//     .all(passport.authenticate())
//     .put(taskApi.save)
//     .delete(taskApi.remove)

// app.route('/tasks/finish/:id')
//     .all(passport.authenticate())
//     .post(taskApi.finish)

// app.route('/stats')
//     .all(passport.authenticate())
//     .get(app.src.api.stats.stats)
// }
