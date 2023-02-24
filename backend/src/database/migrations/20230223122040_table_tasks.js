/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table
      .integer('userId')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE');
    table.text('name').notNullable();
    table.text('description').defaultTo('').notNullable();
    table.integer('priority', 1).notNullable();
    table.timestamp('deadline').notNullable();
    table.boolean('done').defaultTo(false);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('tasks');
}
