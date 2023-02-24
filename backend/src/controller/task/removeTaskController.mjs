import { Util } from '../../utils/util.mjs';

export class RemoveTaskController {
  constructor({ removeTaskService }) {
    this.removeTaskService = removeTaskService;
  }

  async handle(req, res) {
    const { id } = req.params;

    await this.removeTaskService.execute({ id });

    return res.status(Util.STATUS_CODES.OK).send();
  }
}
