import { fetchAgents, fetchCustomers } from '@/lib/data';
import Pagination from '@/components/Pagination';
import ResourceNotFound from '@/components/no-resource';
import { Metadata } from 'next';
import Agents from '@/components/Agents';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Customers',
  description:
    'On this page, we will dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Agents', href: '/admin/agents' },
  { name: 'Tickering', href: '/admin/agents/tickering' },
  { name: 'Settings', href: '/admin/agents/settings' },
];

const buttonLabelAndLink: {
  buttonLabel: string;
  link: { label: string; url: string };
} = {
  buttonLabel: 'agents.cvs',
  link: {
    label: 'Add Agent',
    url: '/admin/agents/new',
  },
};

const linkAndLabels: {
  href: string;
  label: string;
  mainTitle: string;
  mainText: string;
} = {
  href: '/admin/agents/new',
  label: 'add agent',
  mainTitle: 'Oops! No Agents Found',
  mainText:
    'Looks like there are no registered agents in the system at the moment.',
};

export default async function Page() {
  const agents = await fetchAgents();
  return (
    <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <SectionHeading
        tabs={tabs}
        btnAndLink={buttonLabelAndLink}
        mainTitle={{ title: 'Agents' }}
      />
      {agents.length > 0 ? (
        <Agents agents={agents} />
      ) : (
        <ResourceNotFound linkAndLabel={linkAndLabels} />
      )}

      {agents.length > 4 ? (
        <div className="mt-10">
          <Pagination />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
