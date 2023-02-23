import { Util } from '../../utils/util.mjs';

export class CreateUserController {
  constructor({ createUserService }) {
    this.createUserService = createUserService;
  }

  async handle(req, res) {
    const {
      name,
      email,
      initiais: initials,
      password,
      confirmPassword,
    } = req.body;

    await this.createUserService.execute({
      name,
      email,
      initials,
      password,
      confirmPassword,
    });

    return res.status(Util.STATUS_CODES.Created).send();
  }
}
