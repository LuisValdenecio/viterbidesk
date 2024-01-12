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

export default async function Page() {
  const customers = await fetchCustomers();
  return (
    <>
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
    </>
  );
}
