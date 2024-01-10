import { Customers } from '@/components/Customers';
import { HeroPattern } from '@/components/HeroPattern';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';

export const metadata = {
  title: 'Customers',
  description:
    'On this page, we’ll dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

export default function Page() {
  return (
    <>
      <Customers />
      <div className="mt-10">
        <Pagination />
      </div>
    </>
  );
}
