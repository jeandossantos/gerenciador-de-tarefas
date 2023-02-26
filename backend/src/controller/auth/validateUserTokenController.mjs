export class ValidateUserTokenController {
  constructor({ validateTokenService }) {
    this.validateTokenService = validateTokenService;
  }

  async handle(req, res) {
    const { token = null } = req.body;

    const isAuthorized = await this.validateTokenService.execute(token);

    return res.send(isAuthorized);
  }
}
