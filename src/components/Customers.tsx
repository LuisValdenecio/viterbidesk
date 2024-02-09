import { Customer } from '@/lib/definitions';
import { fetchCustomers } from '@/lib/data';
import GetCustomersData from './GetCustomersData';

export default async function Customers() {
  const customers: Customer[] = await fetchCustomers();

  return (
    <>
      <GetCustomersData customers={customers} />
    </>
  );
}
