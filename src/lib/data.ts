'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/[...nextauth]';
import { organizationStore } from '@/store/organization';
import prisma_global_instance from '@/db';

const ITEMS_PER_PAGE = 6;

export async function fetchCustomers() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    const customers = await prisma_global_instance.user.findMany();
    return customers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer data.');
  }
}

export async function fetchTopics(org_id: string) {
  noStore();
  try {
    const topics = await prisma_global_instance.topic.findMany({
      where: {
        org_id: org_id,
      },
    });
    return topics;
  } catch (error) {
    console.error('Database error', error);
    throw new Error('Failed to fetch the topics');
  }
}

export async function fetchIndustries() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    const industries = await prisma_global_instance.industry.findMany();
    return industries;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer data.');
  }
}

export async function fetchOrganizationName(org_id: string) {
  try {
    const organization_name =
      await prisma_global_instance.organization.findFirst({
        where: {
          id: org_id,
        },
        select: {
          name: true,
        },
      });
    return organization_name?.name;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer data.');
  }
}

export async function fetchRevenues() {
  noStore();
  try {
    const revenues = await prisma_global_instance.revenue.findMany();
    return revenues;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer data.');
  }
}

export async function fetchInvitationToken(token: string) {
  noStore();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const invitationToken =
      await prisma_global_instance.activateToken.findUnique({
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

export async function fetchUserNameAndEmail() {
  noStore();

  const session = await getServerSession(authOptions);

  try {
    const user = await prisma_global_instance.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      select: {
        name: true,
        email: true,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchSignInLogs(
  query: string,
  currentPage: number,
  orgId: string,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const filteredSignInLogs = await prisma_global_instance.$queryRaw`
      SELECT user_id, org_id, user_name, "createdAt" FROM signin_log 
        WHERE signin_log.org_id = ${orgId} AND
        user_name ILIKE ${`%${query}%`} 
        ORDER BY "createdAt" DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;

    const totalLogs = await prisma_global_instance.$queryRaw`
      SELECT count(*) FROM signin_log 
        WHERE signin_log.org_id = ${orgId} AND
        user_name ILIKE ${`%${query}%`}`;

    return {
      filteredSignInLogs: filteredSignInLogs,
      totalLogs: Math.ceil(Number(totalLogs[0]?.count) / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user logs.');
  }
}

export async function fetchUserLogs(
  orgId: string,
  query: string,
  currentPage: number,
  operation: string,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const userLogs = await prisma_global_instance.usersLog.findMany({
      where: {
        org_user_belongs_to: orgId,
      },
    });

    const filteredUserLogs = await prisma_global_instance.$queryRaw`
      SELECT * FROM users_log WHERE users_log.org_user_belongs_to = ${orgId} AND
      users_log.operation_performed = ${operation}  AND
      (users_log.user_acted_name ILIKE ${`%${query}%`} OR users_log.user_subject ILIKE ${`%${query}%`} ) 
      ORDER BY "createdAt" DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const totalUserLogs = await prisma_global_instance.$queryRaw`
      SELECT count(*)
      FROM users_log WHERE users_log.org_user_belongs_to = ${orgId} AND
      users_log.operation_performed = ${operation}  AND
      (users_log.user_acted_name ILIKE ${`%${query}%`} OR users_log.user_subject ILIKE ${`%${query}%`} )
    `;

    console.log(filteredUserLogs);

    return {
      userLogs: filteredUserLogs,
      totalUserLogs: Math.ceil(
        Number(totalUserLogs[0]?.count) / ITEMS_PER_PAGE,
      ),
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user logs.');
  }
}

export async function fetchDefaultOrganization() {
  noStore();

  const session = await getServerSession(authOptions);

  let orgOwnedByLoggedInUser =
    await prisma_global_instance.userToOrganization.findFirst({
      where: {
        user_id: session?.user?.id,
        role_name: 'owner',
      },
      select: {
        org_id: true,
      },
    });

  if (!orgOwnedByLoggedInUser) {
    orgOwnedByLoggedInUser =
      await prisma_global_instance.userToOrganization.findFirst({
        where: {
          user_id: session?.user?.id,
        },
        select: {
          org_id: true,
        },
      });
  }

  return orgOwnedByLoggedInUser?.org_id;
}

export async function fetchOrganizations(query: string, currentPage?: number) {
  noStore();

  const session = await getServerSession(authOptions);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const organizations = await prisma_global_instance.$queryRaw`
      SELECT organizations.name, organizations.id, users_to_organizations.role_name
      FROM organizations
      INNER JOIN users_to_organizations ON organizations.id = users_to_organizations.org_id
      WHERE users_to_organizations.user_id = ${session?.user?.id};
    `;

    const selectedOrganizations = await prisma_global_instance.$queryRaw`
      SELECT organizations.name, organizations.id, users_to_organizations.role_name
      FROM organizations
      INNER JOIN users_to_organizations ON organizations.id = users_to_organizations.org_id
      WHERE users_to_organizations.user_id = ${session?.user?.id} AND
      (organizations.name ILIKE ${`%${query}%`} OR organizations.id ILIKE ${`%${query}%`})
      ORDER BY organizations."createdAt" DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;

    const totalOrganizations = await prisma_global_instance.$queryRaw`
      SELECT count(*)
      FROM organizations
      INNER JOIN users_to_organizations ON organizations.id = users_to_organizations.org_id
      WHERE users_to_organizations.user_id = ${session?.user?.id} AND
      (organizations.name ILIKE ${`%${query}%`} OR organizations.id ILIKE ${`%${query}%`})
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;

    return {
      organizations: organizations,
      selectedOrganizations: selectedOrganizations,
      totalOrganizations: Math.ceil(
        Number(totalOrganizations[0]?.count) / ITEMS_PER_PAGE,
      ),
    };
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
      orgOwnedByLoggedInUser =
        await prisma_global_instance.userToOrganization.findFirst({
          where: {
            user_id: session?.user?.id,
            role_name: 'owner',
          },
          select: {
            org_id: true,
          },
        });

      if (!orgOwnedByLoggedInUser) {
        orgOwnedByLoggedInUser =
          await prisma_global_instance.userToOrganization.findFirst({
            where: {
              user_id: session?.user?.id,
            },
            select: {
              org_id: true,
            },
          });
      }
    }

    const allUsers = await prisma_global_instance.$queryRaw`
    SELECT
      users.id,
      users.name,
      users.email,
      users.img,
      users_to_organizations.role_name,
      activate_tokens.email_sent
    FROM users
    JOIN users_to_organizations ON users.id = users_to_organizations.user_id
    JOIN activate_tokens ON users.id = activate_tokens.user_id
    WHERE
    users_to_organizations.org_id = ${orgOwnedByLoggedInUser.org_id} 
    ORDER BY users.name DESC
  `;

    const limitedUsers = await prisma_global_instance.$queryRaw`
      SELECT
        users.id,
        users.name,
        users.email,
        users.img,
        users_to_organizations.role_name,
        activate_tokens.email_sent
      FROM users
      JOIN users_to_organizations ON users.id = users_to_organizations.user_id
      JOIN activate_tokens ON users.id = activate_tokens.user_id
      WHERE
      users_to_organizations.org_id = ${orgOwnedByLoggedInUser.org_id} AND  
      ( users.name ILIKE ${`%${query}%`} OR users.email ILIKE ${`%${query}%`})
      ORDER BY users.name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const totalUsers = await prisma_global_instance.$queryRaw`
    SELECT count(*)
    FROM users
    JOIN users_to_organizations ON users.id = users_to_organizations.user_id
    WHERE
    users_to_organizations.org_id = ${orgOwnedByLoggedInUser.org_id} AND  
    ( users.name ILIKE ${`%${query}%`} OR users.email ILIKE ${`%${query}%`})
    `;

    return {
      users: limitedUsers,
      allUsers: allUsers,
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
    const agent = await prisma_global_instance.user.findUnique({
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
    const user_id = await prisma_global_instance.activateToken.findUnique({
      where: {
        token: token,
      },
      select: {
        user_id: true,
      },
    });

    const user = await prisma_global_instance.user.findUnique({
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
