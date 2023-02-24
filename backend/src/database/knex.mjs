import knex from 'knex';
import knexfile from '../../knexfile.js';

const connection = knex(knexfile);

export { connection };
