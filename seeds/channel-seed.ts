import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('channels').del();

  // Inserts seed entries
  await knex('channels').insert([
    { name: 'X' },
    { name: 'LinkedIn' },
    { name: 'Instagram' },
    { name: 'Reddit' },
  ]);
}
