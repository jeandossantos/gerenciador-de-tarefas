export class FindTaskStatsController {
  constructor({ findTaskStatsService }) {
    this.findTaskStatsService = findTaskStatsService;
  }

  async handle(req, res) {
    const { user_id } = req;

    const stats = await this.findTaskStatsService.execute(user_id);

    return res.status(200).json(stats);
  }
}
