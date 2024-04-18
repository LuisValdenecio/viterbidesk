import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('topics', (table) => {
    table.string('id', 25).primary();
    table.string('name', 255).unique();
    table.string('about', 500);
    table.string('channel_name', 255);
    table.string('org_id', 25).notNullable();

    table
      .foreign('channel_name')
      .references('channels.name')
      .onDelete('cascade')
      .onUpdate('cascade');

    table
      .foreign('org_id')
      .references('organizations.id')
      .onDelete('cascade')
      .onUpdate('cascade');

    table.timestamp('createdAt').defaultTo(knex.fn.now()).index();
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('topics');
}
