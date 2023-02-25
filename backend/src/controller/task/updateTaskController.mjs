import { Util } from '../../utils/util.mjs';

export class UpdateTaskController {
  constructor({ updateTaskService }) {
    this.updateTaskService = updateTaskService;
  }

  async handle(req, res) {
    const { name, description = '', priority, done, deadline } = req.body;

    const { id } = req.params;

    await this.updateTaskService.execute({
      id,
      name,
      description,
      priority,
      done,
      deadline,
    });

    return res.status(Util.STATUS_CODES.OK).send();
  }
}
