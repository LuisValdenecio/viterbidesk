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
  href: '/admin/customers',
  label: 'see customers',
  mainTitle: 'Oops! The customer was not found',
  mainText: 'Looks like this customer is not on the system',
};

export default async function Page() {
  return (
    <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <ResourceNotFound linkAndLabel={linkAndLabels} />
    </div>
  );
}
