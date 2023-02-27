import * as dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
import { setTimeout } from 'timers/promises';

import { prisma } from '../src/database/prisma.mjs';
import { EXISTING_USER } from './mock/existing-user.mjs';
import { EXISTING_TASKS } from './mock/existing-tasks.mjs';
/**this method populate the database with a user and tasks. */
export async function populateDatabase() {
  await clearDatabase();

  await setTimeout(200, 'deleted');

  const user = await prisma.users.create({
    data: {
      ...EXISTING_USER,
      tasks: {
        createMany: {
          data: [...EXISTING_TASKS],
        },
      },
    },
  });

  const task = await prisma.tasks.findFirst({
    where: {
      userId: user.id,
    },
  });

  return { user, task };
}

/** this method removes the existing user and consequently his tasks.*/
export async function clearDatabase() {
  const client = new pg.Pool({
    max: 100,
    connectionString: process.env.DATABASE_URL,
  });

  await client.query('DELETE FROM users');
}
