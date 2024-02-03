'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/[...nextauth]';
import { organizationStore } from '@/store/organization';

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

export async function fetchOrganizations() {
  noStore();

  const session = await getServerSession(authOptions);

  try {
    const organizations = await prisma.$queryRaw`
    SELECT organizations.name, organizations.id
    FROM organizations
    INNER JOIN users_to_organizations ON organizations.id = users_to_organizations.org_id
    WHERE users_to_organizations.user_id = ${session?.user?.id};
  `;

    return organizations;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchAgents(activeOrgId: any) {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  const session = await getServerSession(authOptions);
  //const organization = organizationStore((state : any) => state.activeOrganizationId);
  //console.log("active organization", organization);
  console.log(activeOrgId);

  try {
    let orgOwnedByLoggedInUser = { org_id: activeOrgId };

    if (!activeOrgId) {
      orgOwnedByLoggedInUser = await prisma.userToOrganization.findFirst({
        where: {
          user_id: session?.user?.id,
          role_name: 'owner',
        },
        select: {
          org_id: true,
        },
      });
    }

    const agents = await prisma.$queryRaw`
      SELECT users.id, users.name, users.email, users_to_organizations.role_name
      FROM users
      INNER JOIN users_to_organizations ON users.id = users_to_organizations.user_id
      WHERE users_to_organizations.org_id = ${orgOwnedByLoggedInUser?.org_id}   
    `;

    return agents;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch agent data.');
  }
}

export async function fetchAgentById(id: string) {
  noStore();

  try {
    const agent = await prisma.user.findUnique({
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
