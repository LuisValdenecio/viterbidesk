import { Metadata } from 'next';
import Agents from '@/components/Agents';
import SectionHeading from '@/components/SectionHeading';
import Organization from '@/components/Organizations';

export const metadata: Metadata = {
  title: 'Customers',
  description:
    'On this page, we will dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

const tabs: Array<{ name: string; href: string }> = [
  { name: 'All organisation', href: '/dashboard/organisations' },
  { name: 'Integration', href: '/dashboard/agents/tickering' },
  { name: 'Settings', href: '/dashboard/agents/settings/' },
];

const buttonLabelAndLink: {
  buttonLabel: string;
  link: { label: string; url: string };
} = {
  buttonLabel: 'agents.cvs',
  link: {
    label: 'Add Agent',
    url: '/dashboard/agents/new',
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="">
      <SectionHeading
        tabs={tabs}
        mainTitle={{ title: 'Organisations' }}
        btnAndLink={buttonLabelAndLink}
      />
      <Organization query={query} currentPage={currentPage} />
    </div>
  );
}
