import { unstable_noStore as noStore } from 'next/cache';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchCustomers() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    const customers = await prisma.customer.findMany();
    return customers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer data.');
  }
}

export async function fetchAgents() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    const agents = await prisma.agent.findMany();
    return agents;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch agent data.');
  }
}

export async function fetchAgentById(id: string) {
  noStore();

  try {
    const agent = await prisma.agent.findUnique({
      where: {
        id: id,
      },
    });

    return agent;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch agent.');
  }
}

export async function fetchCustomerById(id: string) {
  noStore();
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
    });

    return customer;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
}
