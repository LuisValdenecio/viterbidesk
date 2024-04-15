import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('revenue').del();

  // Inserts seed entries
  await knex('revenue').insert([
    { revenue: 'Under $25,000' },
    { revenue: '$25,000 - $50,000' },
    { revenue: 'Above $500,000' },
  ]);
}
