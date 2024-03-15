import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('log_description', (table) => {
    table.string('description', 255).primary();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('log_description');
}
