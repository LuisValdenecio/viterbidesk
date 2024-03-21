import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('signin_log', (table) => {
    table.string('id', 25).primary();
    table.string('user_id', 25).notNullable();
    table.string('org_id', 25).notNullable();
    table.string('user_name', 255);

    table
      .foreign('org_id')
      .references('organizations.id')
      .onDelete('cascade')
      .onUpdate('cascade');

    table
      .foreign('user_id')
      .references('users.id')
      .onDelete('cascade')
      .onUpdate('cascade');

    table.timestamp('createdAt').defaultTo(knex.fn.now()).index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('signin_log');
}
