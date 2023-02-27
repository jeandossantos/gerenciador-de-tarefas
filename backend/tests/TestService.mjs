import * as dotenv from 'dotenv';
dotenv.config();
import { setTimeout } from 'timers/promises';
import { EXISTING_USER } from './mock/existing-user.mjs';
import { EXISTING_TASKS } from './mock/existing-tasks.mjs';

import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const prisma = new PrismaClient({
  log: ['query', 'error'],
});

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

/**this method populate the database with a user and tasks. */
export async function populateDatabase() {
  await clearDatabase();

  await setTimeout(200, 'deleted');

  await prisma.$connect();

  try {
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
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

/** this method removes the existing user and consequently his tasks.*/
export async function clearDatabase() {
  try {
    await client.connect();

    await client.query('DELETE FROM users');

    await client.end();
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}
