// Update with your config settings.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'src', 'database', 'mydb.sqlite'),
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'database', 'seeds'),
    },

    useNullAsDefault: true,
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
