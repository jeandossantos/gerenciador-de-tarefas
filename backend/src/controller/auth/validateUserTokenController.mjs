import { Util } from '../../utils/util.mjs';

export class ValidateUserTokenController {
  constructor({ validateTokenService }) {
    this.validateTokenService = validateTokenService;
  }

  async handle(req, res) {
    const { token = null } = req.body;

    const isAuthorized = await this.validateTokenService.execute(token);

    const statusCode = isAuthorized
      ? Util.STATUS_CODES.OK
      : Util.STATUS_CODES.Unauthorized;

    return res.status(statusCode).send(isAuthorized);
  }
}
