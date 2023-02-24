import { Util } from '../../utils/util.mjs';

export class RemoveUserController {
  constructor({ removeUserService }) {
    this.removeUserService = removeUserService;
  }

  async handle(req, res) {
    const { id = '' } = req.params;
    const { userpassword: password = '' } = req.headers;

    await this.removeUserService.execute({ id, password });

    return res.status(Util.STATUS_CODES.No_Content).send();
  }
}
