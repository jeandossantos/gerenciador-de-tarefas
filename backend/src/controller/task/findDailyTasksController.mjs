export class FindDailyTasksController {
  constructor({ findDailyTasksService }) {
    this.findDailyTasksService = findDailyTasksService;
  }

  async handle(req, res) {
    const userId = req.user_id;

    const { search = '', page = 1, limit = 4 } = req.params;

    const tasks = await this.findDailyTasksService.execute({
      search,
      page,
      userId,
      limit,
    });

    return res.json(tasks);
  }
}
