import { Util } from '../../utils/util.mjs';

export class CreateTaskController {
  constructor({ createTaskService }) {
    this.createTaskService = createTaskService;
  }

  async handle(req, res) {
    const { name, description = '', priority, done, deadline } = req.body;

    const userId = req.user_id;

    await this.createTaskService.execute({
      name,
      description,
      priority,
      done,
      deadline,
      userId,
    });

    return res.status(Util.STATUS_CODES.Created).send();
  }
}
