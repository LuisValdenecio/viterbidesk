import { updateAgent } from '@/app/lib/actions';
import { Metadata } from 'next';
import { fetchAgentById } from '@/lib/data';
import { notFound } from 'next/navigation';
//@ts-ignore
import { useFormState } from 'react-dom';
import { Agent } from '@/lib/definitions';
import EditAgentForm from '@/components/Edit-Agent-Form';

const metadata: Metadata = {
  title: 'Add Customer',
  description:
    'On this page, we’ll dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

export default async function Page({ params }: { params: { id: string } }) {
  const agentId = params.id;
  const agent = await fetchAgentById(agentId);

  if (!agent) {
    return notFound();
  }

  return (
    <>
      <EditAgentForm agent={agent} />
    </>
  );
}
