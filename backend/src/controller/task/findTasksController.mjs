export class FindTasksController {
  constructor({ findTasksService }) {
    this.findTasksService = findTasksService;
  }

  async handle(req, res) {
    const userId = req.user_id;

    const { search = '', page = 1, limit = 4 } = req.query;

    const tasks = await this.findTasksService.execute({
      search,
      page,
      userId,
      limit,
    });

    return res.json(tasks);
  }
}
