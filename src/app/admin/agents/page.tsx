import { Customers } from '@/components/Customers';
import Pagination from '@/components/Pagination';
import ResourceNotFound from '@/components/no-resource';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
  description:
    'On this page, we will dive into the different attachment endpoints you can use to manage attachments programmatically.',
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
  mainText: 'Looks like there are no registered agents in the system at the moment.',
};

export default function Page() {
  return (
    <>
      {1 < 0 ? (
        <Customers />
      ) : (
        <ResourceNotFound linkAndLabel={linkAndLabels} />
      )}

      {1 < 0 ? (
        <div className="mt-10">
          <Pagination />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
