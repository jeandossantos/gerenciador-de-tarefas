/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { Util } from '../../utils/util.mjs';

export const users = [
  {
    id: 1,
    name: 'John Doe',
    initials: 'JD',
    email: 'Johndoe@test.com',
    password: Util.encryptPassword('123456'),
  },
];

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('tasks').del();
  await knex('users').insert(users);

  await knex('tasks').insert([
    {
      id: 1,
      name: 'Tarefa de teste criado pela seed',
      description: 'Está é uma tarefa criada para teste.',
      priority: 2,
      deadline: new Date(),
      done: true,
      userId: users[0].id,
    },
  ]);
}
