import { Util } from '../../utils/util.mjs';

export class MarkAsDoneController {
  constructor({ markAsDoneService }) {
    this.markAsDoneService = markAsDoneService;
  }

  async handle(req, res) {
    const { id } = req.params;

    await this.markAsDoneService.execute({ id });

    return res.status(Util.STATUS_CODES.OK).send();
  }
}
