import ResourceNotFound from '@/components/no-resource';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
  description:
    'On this page, we’ll dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

const linkAndLabels: {
  href: string;
  label: string;
  mainTitle: string;
  mainText: string;
} = {
  href: '/admin/tags/new',
  label: 'add tag',
  mainTitle: 'Oops! No Tags Found',
  mainText: `Looks like there are no tags in the system at the moment.`,
};

export default function Page() {
  return <></>;
}
