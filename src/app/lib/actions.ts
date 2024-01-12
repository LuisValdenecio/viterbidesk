'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  agentName: z.string(),
  agentEmail: z.string(),
  agentImgUrl: z.string(),
  agentRole: z.enum(['admin', 'staff', 'team-lead']),
});

const CreateAgent = FormSchema.omit({});
const UpdateAgent = FormSchema.omit({});

export async function createAgent(formData: FormData) {
  const { agentName, agentEmail, agentImgUrl, agentRole } = CreateAgent.parse({
    agentName: formData.get('name'),
    agentEmail: formData.get('email'),
    agentImgUrl: '/agents/steven-tey-1.png',
    agentRole: formData.get('role'),
  });

  await sql`
        INSERT INTO agents (name, email, image_url, role)
        VALUES (${agentName}, ${agentEmail}, ${agentImgUrl}, ${agentRole})
        ON CONFLICT (id) DO NOTHING;
    `;

  revalidatePath('/admin/agents');
  redirect('/admin/agents');
}

export async function updateAgent(id: string, formData: FormData) {
  // validate form using zod
  const { agentName, agentEmail, agentImgUrl, agentRole } = UpdateAgent.parse({
    agentName: formData.get('name'),
    agentEmail: formData.get('email'),
    agentImgUrl: '/agents/steven-tey-1.png',
    agentRole: formData.get('role'),
  });

  await sql`
        UPDATE agents
        SET name = ${agentName}, email = ${agentEmail}, role = ${agentRole}
        WHERE id = ${id}
    `;

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
