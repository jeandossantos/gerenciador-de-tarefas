import { prisma } from '../database/prisma.mjs';
import { BaseUserRepository } from './base/baseUserRepository.mjs';

export class UserRepository extends BaseUserRepository {
  constructor() {
    super();

    this.connection = prisma.users;
  }

  async findByEmail(email) {
    return await this.connection.findFirst({
      where: {
        email,
      },
    });
  }

  async create(user) {
    const tarefaDefault = {
      name: 'Primeiro Login',
      description: 'Está é uma tarefa criada por padrão pelo sistema.',
      priority: 0,
      deadline: new Date(),
      done: false,
    };

    await this.connection.create({
      data: {
        ...user,
        tasks: {
          create: {
            ...tarefaDefault,
          },
        },
      },
    });
  }

  async findById(id) {
    return await this.connection.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  async remove({ id }) {
    return await this.connection.delete({
      where: {
        id: parseInt(id),
      },
    });
  }

  async updatePassword({ id, newPassword }) {
    return await this.connection.update({
      where: {
        id: Number(id),
      },
      data: {
        password: newPassword,
      },
    });
  }

  async update({ id, ...user }) {
    return await this.connection.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...user,
      },
    });
  }
}
