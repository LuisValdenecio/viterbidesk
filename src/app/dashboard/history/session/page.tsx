import SignInHistoryLogEntry from '@/components/SigninHistoryLogEntry';
import UserSearch from '@/components/UserSearch';
import { Menu } from '@headlessui/react';

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
    <>
      <div className="pl-6">
        <UserSearch placeholder="search for user..." />
      </div>
      <SignInHistoryLogEntry
        query={query}
        currentPage={currentPage}
        logOoperation={'invite'}
      />
    </>
  );
}
