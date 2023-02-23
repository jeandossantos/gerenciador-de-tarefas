import { Util } from '../../utils/util.mjs';

export class AuthenticateUserController {
  constructor({ authenticateUserService }) {
    this.authenticateUserService = authenticateUserService;
  }

  async handle(req, res) {
    const { email, password } = req.body;

    const payload = await this.authenticateUserService.execute({
      email,
      password,
    });

    return res.status(Util.STATUS_CODES.OK).json(payload);
  }
}
