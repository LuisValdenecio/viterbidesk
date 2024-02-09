import { fetchUsersPages } from '@/lib/data';
import Pagination from './Pagination';

export default async function PaginationWrapper({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const totalPages = await fetchUsersPages(query);

  return <Pagination totalPages={totalPages} />;
}
