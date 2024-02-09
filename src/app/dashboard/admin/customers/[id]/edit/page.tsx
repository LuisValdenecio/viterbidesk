import { Metadata } from 'next';
import { fetchCustomerById } from '@/lib/data';
import { notFound } from 'next/navigation';
//@ts-ignore
import { useFormState } from 'react-dom';

import EditCustomerForm from '@/components/Edit-Customer-Form';

const metadata: Metadata = {
  title: 'Add Customer',
  description:
    'On this page, we’ll dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

export default async function Page({ params }: { params: { id: string } }) {
  const customerId = params.id;
  const customer = await fetchCustomerById(customerId);

  if (!customer) {
    return notFound();
  }

  return (
    <>
      <EditCustomerForm customer={customer} />
    </>
  );
}
