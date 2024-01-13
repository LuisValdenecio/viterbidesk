import ResourceNotFound from '@/components/no-resource';
import Customers from '@/components/Customers';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';
import { fetchCustomers } from '@/lib/data';
import SectionHeading from '@/components/SectionHeading';

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
  href: '/admin/customers/new',
  label: 'add customer',
  mainTitle: 'Oops! No Customers Found',
  mainText:
    'Looks like there are no registered customers in the system at the moment.',
};

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Tickering', href: '/admin/customers/tickering' },
  { name: 'Settings', href: '/admin/customers/settings' },
];

const buttonLabelAndLink: {
  buttonLabel: string;
  link: { label: string; url: string };
} = {
  buttonLabel: 'customers.cvs',
  link: {
    label: 'Add Customer',
    url: '/admin/customers/new',
  },
};

export default async function Page() {
  const customers = await fetchCustomers();
  return (
    <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <SectionHeading
        tabs={tabs}
        btnAndLink={buttonLabelAndLink}
        mainTitle={{ title: 'Customers' }}
      />
      {customers.length > 0 ? (
        <Customers people={customers} />
      ) : (
        <ResourceNotFound linkAndLabel={linkAndLabels} />
      )}

      {customers.length > 4 ? (
        <div className="mt-10">
          <Pagination />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
