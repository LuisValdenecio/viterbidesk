'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/[...nextauth]';
import { Organization, PrismaClient, User } from '@prisma/client';
import { organizationStore } from '@/store/organization';

//import { AuthError } from 'next-auth';
//import { signIn } from '../../../auth';

const prisma = new PrismaClient();

const AgentFormSchema = z.object({
  agentName: z.string().min(1, {
    message: 'Please type in your first and last name.',
  }),
  getOrganizationId: z.string().min(25, {
    message: 'Please provide the id for the organization',
  }),
  agentEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),

  agentRole: z.enum(['admin', 'owner', 'agent', 'customer'], {
    invalid_type_error: 'Please select a role for this agent.',
  }),
});

const CustomerFormSchema = z.object({
  customerName: z.string().min(1, {
    message: 'Please type in the customers name',
  }),
  customerEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  customerImgUrl: z.string(),
});

const OrganizationFormSchema = z.object({
  organizationName: z.string().min(1, {
    message: 'Please type in the organization name',
  }),
});

const CreateAgent = AgentFormSchema.omit({});
const UpdateAgent = AgentFormSchema.omit({});

const CreateOrganization = OrganizationFormSchema.omit({});
const updateOrganization = OrganizationFormSchema.omit({});

// This is temporary until @types/react-dom is updated
export type StateAgent = {
  errors?: {
    agentName?: string[];
    agentEmail?: string[];
    agentImgUrl?: string[];
    agentRole?: string[];
  };
  message?: string | null;
};

export type StateCustomer = {
  errors?: {
    customerName?: string[];
    customerEmail?: string[];
    customerImgUrl?: string[];
  };
  message?: string | null;
};

export async function createOrganization(
  prevState: StateCustomer,
  formData: FormData,
) {
  const validatedFields = CreateOrganization.safeParse({
    organizationName: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to register organization.',
    };
  }

  const { organizationName } = validatedFields.data;
  const session = await getServerSession(authOptions);

  try {
    // create an org and assign ownership rights to the loggedin user
    const newOrganization: Organization = await prisma.organization.create({
      data: {
        name: organizationName,
        userToOrganization: {
          create: {
            user_id: session?.user?.id,
            role_name: 'owner',
          },
        },
      },
    });

    // update session so that it also contains the newly created organization id
    //await fetch(`/api/auth/session?organizationId=${newOrganization.id}`)
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to register organization.',
    };
  }

  revalidatePath('/organizations/agents');
  redirect('/organizations/agents');
}

export async function scheduleEmailInvitation(emails: any, activeOrgId: any) {
  try {
    const session = await getServerSession(authOptions);

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

    emails.map(async (email: string) => {
      const newUser: User = await prisma.user.create({
        data: {
          name: 'Someone',
          email: email,
          userToOrganization: {
            create: {
              org_id: orgOwnedByLoggedInUser.org_id,
              role_name: 'agent',
            },
          },
        },
      });
    });
  } catch (error) {
    console.error(error);
  }
}

export async function createAgent(prevState: StateAgent, formData: FormData) {
  console.log(formData);

  const session = await getServerSession(authOptions);
  const orgOwnedByLoggedInUser = await prisma.userToOrganization.findFirst({
    where: {
      user_id: session?.user?.id,
      role_name: 'owner',
    },
    select: {
      org_id: true,
    },
  });

  const validatedFields = CreateAgent.safeParse({
    agentName: formData.get('name'),
    agentEmail: formData.get('email'),
    agentRole: formData.get('role'),
    getOrganizationId: formData.get('org_id') || orgOwnedByLoggedInUser?.org_id,
  });

  console.log(validatedFields);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { agentName, agentEmail, agentRole, getOrganizationId } =
    validatedFields.data;

  console.log(validatedFields.data);

  try {
    const newUser: User = await prisma.user.create({
      data: {
        name: agentName,
        email: agentEmail,
        userToOrganization: {
          create: {
            org_id: getOrganizationId,
            role_name: agentRole,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath('/dashboard/admin/agents');
  redirect('/dashboard/admin/agents');
}

export async function updateAgent(
  id: string,
  prevState: StateAgent,
  formData: FormData,
) {
  // validate form using zod
  const validatedFields = UpdateAgent.safeParse({
    agentName: formData.get('name'),
    agentEmail: formData.get('email'),
    agentImgUrl: '/agents/steven-tey-1.png',
    agentRole: formData.get('role'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { agentName, agentEmail, agentImgUrl, agentRole } =
    validatedFields.data;

  try {
    const updateAgent = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: agentName,
        email: agentEmail,
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to update agent',
    };
  }

  revalidatePath('/dashboard/admin/agents');
  redirect('/dashboard/admin/agents');
}

export async function deleteAgent(id: string) {
  try {
    const deleteAgent = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    revalidatePath('/admin/agents');
    return { message: 'Deleted agent.' };
  } catch (e) {
    return {
      message: 'Database Error: Failed to delete agent',
    };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const deleteCustomer = await prisma.customer.delete({
      where: {
        id: id,
      },
    });

    revalidatePath('/dashboard/admin/agents');
    return { message: 'Deleted Customer.' };
  } catch (e) {
    return {
      message: 'Database Error: Failed to delete customer',
    };
  }
}
