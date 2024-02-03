import { fetchAgents, fetchCustomers } from '@/lib/data';
import Pagination from '@/components/Pagination';
import ResourceNotFound from '@/components/no-resource';
import { Metadata } from 'next';
import Agents from '@/components/Agents';
import SectionHeading from '@/components/SectionHeading';
import { Suspense } from 'react';
import { UserSkeleton } from '@/components/Skeletons';

export const metadata: Metadata = {
  title: 'Customers',
  description:
    'On this page, we will dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Agents', href: '/dashboard/admin/agents' },
  { name: 'Tickering', href: '/dashboard/admin/agents/tickering' },
  { name: 'Settings', href: '/dashboard/admin/agents/settings' },
];

const buttonLabelAndLink: {
  buttonLabel: string;
  link: { label: string; url: string };
} = {
  buttonLabel: 'agents.cvs',
  link: {
    label: 'Add Agent',
    url: '/dashboard/admin/agents/new',
  },
};

export default async function Page() {
  return (
    <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <SectionHeading
        tabs={tabs}
        btnAndLink={buttonLabelAndLink}
        mainTitle={{ title: 'Agents' }}
      />
      <Agents />
    </div>
  );
}
