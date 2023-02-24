import { Util } from '../../utils/util.mjs';

export class UpdateUserPasswordController {
  constructor({ updateUserPasswordService }) {
    this.updateUserPasswordService = updateUserPasswordService;
  }

  async handle(req, res) {
    const {
      oldPassword = '',
      newPassword = '',
      confirmNewPassword = '',
    } = req.body;

    const { id = '' } = req.params;

    await this.updateUserPasswordService.execute({
      id,
      oldPassword,
      newPassword,
      confirmNewPassword,
    });

    return res.status(Util.STATUS_CODES.No_Content).send();
  }
}
