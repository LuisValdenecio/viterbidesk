import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('industry', (table) => {
    table.string('name', 255).primary();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('industry');
}
