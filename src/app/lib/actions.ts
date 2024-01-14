'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const AgentFormSchema = z.object({
  agentName: z.string().min(1, {
    message: 'Please type in your first and last name.',
  }),
  agentEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  agentImgUrl: z.string(),
  agentRole: z.enum(['admin', 'staff', 'team-lead'], {
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

const CreateAgent = AgentFormSchema.omit({});
const UpdateAgent = AgentFormSchema.omit({});

const CreateCustomer = CustomerFormSchema.omit({});
const UpdateCustomer = CustomerFormSchema.omit({});

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

export async function createCustomer(
  prevState: StateCustomer,
  formData: FormData,
) {
  const validatedFields = CreateCustomer.safeParse({
    customerName: formData.get('name'),
    customerEmail: formData.get('email'),
    customerImgUrl: '/customers/steph-dietz.png',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to register Customer.',
    };
  }

  const { customerName, customerEmail, customerImgUrl } = validatedFields.data;

  try {
    await sql`
        INSERT INTO customers (name, email, image_url)
        VALUES (${customerName}, ${customerEmail}, ${customerImgUrl})
        ON CONFLICT (id) DO NOTHING;
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to register Customer.',
    };
  }

  revalidatePath('/admin/customers');
  redirect('/admin/customers');
}

export async function createAgent(prevState: StateAgent, formData: FormData) {
  const validatedFields = CreateAgent.safeParse({
    agentName: formData.get('name'),
    agentEmail: formData.get('email'),
    agentImgUrl: '/agents/steven-tey-1.png',
    agentRole: formData.get('role'),
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
  const { agentName, agentEmail, agentImgUrl, agentRole } =
    validatedFields.data;

  try {
    await sql`
        INSERT INTO agents (name, email, image_url, role)
        VALUES (${agentName}, ${agentEmail}, ${agentImgUrl}, ${agentRole})
        ON CONFLICT (id) DO NOTHING;
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Agent.',
    };
  }

  revalidatePath('/admin/agents');
  redirect('/admin/agents');
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
    await sql`
        UPDATE agents
        SET name = ${agentName}, email = ${agentEmail}, role = ${agentRole}
        WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to update agent',
    };
  }

  revalidatePath('/admin/agents');
  redirect('/admin/agents');
}

export async function deleteAgent(id: string) {
  try {
    await sql`DELETE FROM agents WHERE id = ${id}`;
    revalidatePath('/admin/agents');
    return { message: 'Deleted invoice.' };
  } catch (e) {
    return {
      message: 'Database Error: Failed to delete invoice',
    };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/admin/agents');
    return { message: 'Deleted Customer.' };
  } catch (e) {
    return {
      message: 'Database Error: Failed to delete customer',
    };
  }
}
