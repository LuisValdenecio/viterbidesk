'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/[...nextauth]';
import { Organization, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { sendEmail } from './email';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { compare } from 'bcrypt';
import { format } from 'date-fns';
import prisma_global_instance from '@/db';

const AgentFormSchema = z.object({
  agentName: z.string().min(1, {
    message: 'Please provide the id for the organization',
  }),
  agentEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

const NewTopicFormSchema = z.object({
  getOrganizationId: z.string().min(25, {
    message: 'Please provide the id for the organization',
  }),
  topicDescription: z.string().min(1, {
    message: 'Please type in a topic description',
  }),
  topicName: z.string().min(1, {
    message: 'Please type in the topic name',
  }),
});

const NewAgentFormSchema = z.object({
  getOrganizationId: z.string().min(25, {
    message: 'Please provide the id for the organization',
  }),
  userEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),

  userRole: z.enum(['admin', 'owner', 'agent', 'customer'], {
    invalid_type_error: 'Please select a role for this agent.',
  }),
});

const UserRoleFormSchema = z.object({
  userRole: z.enum(['admin', 'owner', 'agent', 'customer'], {
    invalid_type_error: 'Please select a role for this agent.',
  }),
});

const OrganizationFormSchema = z.object({
  organizationName: z.string().min(1, {
    message: 'Please type in the organization name',
  }),
});

const CreateNewAgent = NewAgentFormSchema.omit({});
const createNewTopic = NewTopicFormSchema.omit({});
const UpdateAgent = AgentFormSchema.omit({});
const UpdateUserRole = UserRoleFormSchema.omit({});

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

export type StateTopic = {
  errors?: {
    name: string[];
    about: string[];
  };
  message?: string | null;
};

export async function fetchOTP(userId: string) {
  try {
    const otp = await prisma_global_instance.oTP.findFirst({
      where: {
        user_id: userId,
      },
      select: {
        password: true,
      },
    });

    return otp?.password;
  } catch (error) {
    console.log(error);
  }
}

export async function resendOTP(userId: string, userEmail: string) {
  try {
    const OTP = `${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10,
    )}${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10,
    )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;

    await prisma_global_instance.oTP.update({
      where: {
        user_id: userId,
      },
      data: {
        password: OTP,
      },
    });

    const emailResult = await sendEmail({
      recipientEmail: [userEmail],
      userId: userId,
      message: `Verification code : ${OTP}`,
    });

    return emailResult;
  } catch (error) {
    console.log(error);
  }
}

export async function registerNewUser(formData: FormData) {
  try {
    //const { name, email, telefone, password } = await request.json();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const hashedPassword = await hash(password, 10);

    //console.log({ name, email, telefone, password });

    const isEmailRepeated = await prisma_global_instance.user.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
      },
    });

    if (isEmailRepeated?.email) {
      return {
        message: 'Email already exists on the system',
      };
    }

    const user = await prisma_global_instance.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        active: true,
        activateToken: {
          create: {
            token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
            activated: new Date(),
          },
        },
      },
    });

    const userToken = await prisma_global_instance.activateToken.findUnique({
      where: {
        user_id: user.id,
      },
      select: {
        token: true,
      },
    });

    const OTP = `${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10,
    )}${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10,
    )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;

    const emailResult = await sendEmail({
      recipientEmail: [email],
      userId: user.id,
      message: `Verification code : ${OTP}`,
    });

    console.log(emailResult);

    if (emailResult?.message === 'Email was delivered') {
      await prisma_global_instance.oTP.create({
        data: {
          password: OTP,
          user_id: user.id,
        },
      });
    } else {
      return {
        message: 'We couldnt send the verification code',
      };
    }

    return {
      message: 'account registered successfuly',
    };
  } catch (e) {
    console.log(e);
    return {
      message: 'error',
    };
  }
}

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  const oldPassword = formData.get('old_password');
  const newPassword = formData.get('new_password');

  try {
    const user = await prisma_global_instance.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    });

    console.log(oldPassword);
    const passwordsMatch = await compare(oldPassword, user.password);
    console.log(passwordsMatch);

    if (passwordsMatch) {
      const hashedPassword = await hash(newPassword as string, 10);
      console.log('pass match');

      const updatedUser = await prisma_global_instance.user.update({
        data: {
          password: hashedPassword,
        },
        where: {
          id: session?.user?.id,
        },
      });

      if (updatedUser) {
        return {
          message: 'password updated successfully',
        };
      }
    } else {
      console.log('pass dont match');
      return {
        message: 'the old password is incorrect',
      };
    }
  } catch (error) {
    return {
      message: "Operation failed : couldn't change password",
    };
  }
}

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
  authOptions;

  try {
    // create an org and assign ownership rights to the loggedin user
    const newOrganization: Organization =
      await prisma_global_instance.organization.create({
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

  revalidatePath('/dashboard/agents');
  redirect('/dashboard/agents');
}

export async function isOwnerOfOrganization(userId: string, orgId: string) {
  try {
    const isOwner = await prisma_global_instance.userToOrganization.findFirst({
      where: {
        user_id: userId,
        org_id: orgId,
        role_name: 'owner',
      },
      select: {
        org_id: true,
      },
    });

    return isOwner ? true : false;
  } catch (error) {
    console.error(error);
  }
}

export async function scheduleEmailInvitation(emails: any, activeOrgId: any) {
  try {
    const session = await getServerSession(authOptions);

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
    }

    emails.map(async (email: string) => {
      const newUser: User = await prisma_global_instance.user.create({
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

export async function createTopic(prevState: StateTopic, formData: FormData) {
  const session = await getServerSession(authOptions);
  const orgOwnedByLoggedInUser =
    await prisma_global_instance.userToOrganization.findFirst({
      where: {
        user_id: session?.user?.id,
        role_name: 'owner',
      },
      select: {
        org_id: true,
      },
      orderBy: {
        createdAt: 'desc', // Sort by createdAt column in descending order
      },
    });

  const validatedFields = createNewTopic.safeParse({
    topicName: formData.get('name'),
    topicDescription: formData.get('about'),
    getOrganizationId: formData.get('org_id') || orgOwnedByLoggedInUser?.org_id,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields',
    };
  }

  // Prepare data for insertion into the database
  const { topicName, getOrganizationId, topicDescription } =
    validatedFields.data;

  try {
    const isTopicNameRepeated = await prisma_global_instance.topic.findUnique({
      where: {
        name: topicName,
      },
      select: {
        name: true,
      },
    });

    if (isTopicNameRepeated?.name) {
      return {
        message: 'Topic name already exists',
      };
    }

    const newTopic = await prisma_global_instance.topic.create({
      data: {
        name: topicName,
        about: topicDescription,
        org_id: getOrganizationId,
      },
    });

    return {
      message: 'All fields are valid',
    };
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error',
    };
  }
}

export async function createAgent(prevState: StateAgent, formData: FormData) {
  const session = await getServerSession(authOptions);
  const orgOwnedByLoggedInUser =
    await prisma_global_instance.userToOrganization.findFirst({
      where: {
        user_id: session?.user?.id,
        role_name: 'owner',
      },
      select: {
        org_id: true,
      },
      orderBy: {
        createdAt: 'desc', // Sort by createdAt column in descending order
      },
    });

  const validatedFields = CreateNewAgent.safeParse({
    userEmail: formData.get('email'),
    userRole: formData.get('role'),
    getOrganizationId: formData.get('org_id') || orgOwnedByLoggedInUser?.org_id,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields',
    };
  }

  // Prepare data for insertion into the database
  const { userEmail, userRole, getOrganizationId } = validatedFields.data;

  try {
    // write a prsima query to search for a user with the agentEmail
    const isEmailRepeated = await prisma_global_instance.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        email: true,
      },
    });

    if (isEmailRepeated?.email) {
      return {
        message: 'Email already exists on the system',
      };
    }

    const newUser: User = await prisma_global_instance.user.create({
      data: {
        email: userEmail,
        userToOrganization: {
          create: {
            org_id: getOrganizationId,
            role_name: userRole,
          },
        },
        activateToken: {
          create: {
            token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
          },
        },
      },
    });

    const userToken = await prisma_global_instance.activateToken.findUnique({
      where: {
        user_id: newUser.id,
      },
      select: {
        token: true,
      },
    });

    const emailResult = await sendEmail({
      recipientEmail: [userEmail],
      userId: newUser.id,
      message: `Click link to verify : http://localhost:3000/invite-activate/${userToken?.token}`,
    });

    await prisma_global_instance.usersLog.create({
      data: {
        user_acted_id: session?.user?.id,
        user_acted_name: session?.user?.name,
        user_subject: newUser.name || newUser.email,
        org_user_belongs_to: getOrganizationId,
        operation_performed: 'invite',
      },
    });

    return {
      message: 'All fields are valid',
      emailResult: emailResult,
    };
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error',
    };
  }
}

export async function registerSignIn(orgId: string) {
  console.log('registerSignIn');

  const session = await getServerSession(authOptions);

  try {
    // register logs once for day for each user
    const lastSignIn = await prisma_global_instance.signInLog.findMany({
      where: {
        user_id: session?.user?.id,
        org_id: orgId,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(lastSignIn[0]);

    if (lastSignIn[0]) {
      if (
        format(lastSignIn[0]?.createdAt, 'yyyy-MM-dd') !==
        format(new Date(), 'yyyy-MM-dd')
      ) {
        await prisma_global_instance.signInLog.create({
          data: {
            user_id: session?.user?.id,
            org_id: orgId,
            user_name: session?.user?.name,
          },
        });
      } else {
        console.log('already signed');
      }
    } else {
      await prisma_global_instance.signInLog.create({
        data: {
          user_id: session?.user?.id,
          org_id: orgId,
          user_name: session?.user?.name,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function setActiveOrganization(userId: string) {
  try {
    const activeOrganization =
      await prisma_global_instance.userToOrganization.findMany({
        where: {
          user_id: userId,
          role_name: 'owner',
        },
        select: {
          org_id: true,
        },
      });

    return activeOrganization;
  } catch (error) {
    console.error(error);
  }
}

export async function resendInvitation(id: string, orgId: string) {
  const session = await getServerSession(authOptions);

  try {
    // fetch the user email and set to a constant named agentEmail
    const user = await prisma_global_instance.user.findUnique({
      where: {
        id: id,
      },
      select: {
        email: true,
        name: true,
      },
    });

    // update the token associated with the user id to a new token
    const newUserToken = await prisma_global_instance.activateToken.update({
      where: {
        user_id: id,
      },
      data: {
        token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
      },
    });

    const resendResult = await sendEmail({
      recipientEmail: [user?.email],
      userId: id,
      message: `Click link to verify : http://localhost:3000/activate/${newUserToken?.token}`,
    });

    if (resendResult?.message === 'Email was not delivered') {
      return {
        message: 'Email was not delivered',
      };
    }

    await prisma_global_instance.usersLog.create({
      data: {
        user_acted_id: session?.user?.id,
        user_acted_name: session?.user?.name,
        user_subject: user?.name || user?.email,
        org_user_belongs_to: orgId,
        operation_performed: 'invite',
      },
    });

    return {
      message: 'Email resent sucessfully',
    };
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserRole(
  id: string,
  prevState: StateAgent,
  formData: FormData,
) {
  const session = await getServerSession(authOptions);

  const validatedFields = UpdateUserRole.safeParse({
    userRole: formData.get('role'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please do select a role for this user',
    };
  }

  const { userRole } = validatedFields.data;

  try {
    const updateAgent = await prisma_global_instance.userToOrganization.update({
      where: {
        user_id: id,
        org_id: formData.get('org_id') as string,
      },
      data: {
        role_name: userRole,
      },
    });

    await prisma_global_instance.usersLog.create({
      data: {
        user_acted_id: session?.user?.id,
        user_acted_name: session?.user?.name,
        user_subject: formData.get('user_name') as string,
        org_user_belongs_to: formData.get('org_id') as string,
        operation_performed: 'update',
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to update agent',
    };
  }

  revalidatePath('/dashboard/agents');
  redirect('/dashboard/agents');
}

export async function updateAgent(
  id: string,
  prevState: StateAgent,
  formData: FormData,
) {
  console.log(formData);
  const session = await getServerSession(authOptions);

  // validate form using zod
  const validatedFields = UpdateAgent.safeParse({
    agentName: formData.get('name'),
    agentEmail: formData.get('email'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { agentEmail, agentName } = validatedFields.data;

  try {
    const updateAgent = await prisma_global_instance.user.update({
      where: {
        id: id,
      },
      data: {
        email: agentEmail,
        name: agentName,
      },
    });

    await prisma_global_instance.usersLog.create({
      data: {
        user_acted_id: session?.user?.id,
        user_acted_name: session?.user?.name,
        user_subject: updateAgent.name as string,
        org_user_belongs_to: formData.get('org_id') as string,
        operation_performed: 'update',
      },
    });
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to update agent',
    };
  }

  revalidatePath('/dashboard/');
  redirect('/dashboard/');
}

export async function deleteAgent(id: string, orgId: string) {
  const session = await getServerSession(authOptions);

  try {
    const deletedAgent = await prisma_global_instance.user.delete({
      where: {
        id: id,
      },
    });

    const actingUserName = await prisma_global_instance.user.findFirst({
      where: {
        id: session?.user?.id,
      },
      select: {
        name: true,
      },
    });

    await prisma_global_instance.usersLog.create({
      data: {
        user_acted_id: session?.user?.id,
        user_acted_name: actingUserName?.name,
        user_subject: deletedAgent.name || deletedAgent.email,
        org_user_belongs_to: orgId,
        operation_performed: 'delete',
      },
    });

    revalidatePath('/dashboard/');
    redirect('/dashboard/');
  } catch (e) {
    console.log(e);
    return {
      message: 'Database Error: Failed to delete agent',
    };
  }
}

export async function setUpInvitation(
  id: string,
  token: string,
  prevState: StateAgent,
  formData: FormData,
) {
  try {
    const password = formData.get('password');
    const userName = formData.get('name');

    const hashedPassword = await hash(password as string, 10);

    await prisma_global_instance.user.update({
      where: {
        id: id,
      },
      data: {
        active: true,
        name: userName as string,
        password: hashedPassword,
      },
    });

    // only when the user setups up account set the date:
    await prisma_global_instance.activateToken.update({
      where: {
        token,
      },
      data: {
        activated: new Date(),
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to set up user',
    };
  }

  revalidatePath('/login');
  redirect('/login');
}
