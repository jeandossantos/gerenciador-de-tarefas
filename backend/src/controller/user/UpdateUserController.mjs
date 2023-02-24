import { Util } from '../../utils/util.mjs';

export class UpdateUserController {
  constructor({ updateUserService }) {
    this.updateUserService = updateUserService;
  }

  async handle(req, res) {
    const { name, email, initiais: initials = '' } = req.body;

    const { id = '' } = req.params;

    await this.updateUserService.execute({
      id,
      name,
      email,
      initials,
    });

    return res.status(Util.STATUS_CODES.No_Content).send();
  }
}
