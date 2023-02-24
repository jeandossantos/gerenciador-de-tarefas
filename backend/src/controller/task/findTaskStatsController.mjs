export class FindTaskStatsController {
  constructor({ findTaskStatsService }) {
    this.findTaskStatsService = findTaskStatsService;
  }

  async handle(req, res) {
    const { user_id } = req;

    await this.findTaskStatsService.execute(user_id);

    return res.status(200).send();
  }
}
