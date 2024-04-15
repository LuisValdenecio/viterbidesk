import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('aritcles_log', (table) => {
    table.string('id', 25).primary();
    table.string('article_title', 255);
    table.string('user_acted_name', 255);
    table.string('user_subject', 255);
    table.string('user_acted_id').notNullable();
    table.string('operation_performed').notNullable();
    table.string('org_user_belongs_to').notNullable();

    table.foreign('user_acted_id').references('users.id').onUpdate('cascade');

    table
      .foreign('operation_performed')
      .references('log_description.description')
      .onUpdate('cascade');

    table
      .foreign('org_user_belongs_to')
      .references('organizations.id')
      .onUpdate('cascade');

    table.timestamp('createdAt').defaultTo(knex.fn.now()).index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('aritcles_log');
}
