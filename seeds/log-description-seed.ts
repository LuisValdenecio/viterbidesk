import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('log_description').del();

  // Inserts seed entries
  await knex('log_description').insert([
    { description: 'delete' },
    { description: 'update' },
    { description: 'invite' },
  ]);
}
