'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/[...nextauth]';
import { organizationStore } from '@/store/organization';

const prisma = new PrismaClient();
const ITEMS_PER_PAGE = 6;

export async function fetchCustomers() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    const customers = await prisma.user.findMany();
    return customers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer data.');
  }
}

export async function fetchInvitationToken(token: string) {
  noStore();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const invitationToken = await prisma.activateToken.findUnique({
      where: {
        token: token,
      },
      select: {
        activated: true,
      },
    });

    return !invitationToken?.activated;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchOrganizations() {
  noStore();

  const session = await getServerSession(authOptions);

  try {
    const organizations = await prisma.$queryRaw`
    SELECT organizations.name, organizations.id, users_to_organizations.role_name
    FROM organizations
    INNER JOIN users_to_organizations ON organizations.id = users_to_organizations.org_id
    WHERE users_to_organizations.user_id = ${session?.user?.id};
  `;

    return organizations;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchAgents(
  activeOrgId: any,
  query: string,
  currentPage: number,
) {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  const session = await getServerSession(authOptions);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  //const organization = organizationStore((state : any) => state.activeOrganizationId);
  //console.log("active organization", organization);

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

    const invoices = await prisma.$queryRaw`
      SELECT
        users.id,
        users.name,
        users.email,
        users_to_organizations.role_name
      FROM users
      JOIN users_to_organizations ON users.id = users_to_organizations.user_id
      WHERE
      users_to_organizations.org_id = ${orgOwnedByLoggedInUser.org_id} AND  
      ( users.name ILIKE ${`%${query}%`} OR users.email ILIKE ${`%${query}%`})
      ORDER BY users.name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const totalUsers = await prisma.$queryRaw`
    SELECT count(*)
    FROM users
    JOIN users_to_organizations ON users.id = users_to_organizations.user_id
    WHERE
    users_to_organizations.org_id = ${orgOwnedByLoggedInUser.org_id} AND  
    ( users.name ILIKE ${`%${query}%`} OR users.email ILIKE ${`%${query}%`})
    `;

    return {
      users: invoices,
      totalUsers: Math.ceil(Number(totalUsers[0]?.count) / ITEMS_PER_PAGE),
    };
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

// create a method that fetches a user using their email
export async function fetchUserInvitationToken(token: string) {
  noStore();

  try {
    const user_id = await prisma.activateToken.findUnique({
      where: {
        token: token,
      },
      select: {
        user_id: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: user_id?.user_id,
      },
      select: {
        email: true,
        id: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}
