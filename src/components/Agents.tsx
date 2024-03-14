'use client';

import GetAgentsData from './GetAgentsData';
import { Suspense, useContext, useEffect, useState } from 'react';
import { fetchAgents } from '@/lib/data';
import { UserSkeleton } from './Skeletons';
import Pagination from './Pagination';
import { Disclosure, Menu } from '@headlessui/react';
import { FunnelIcon } from '@heroicons/react/20/solid';
import UserSearch from '@/components/UserSearch';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import SimpleSearchAgent from '@/components/SimpleSearchAgent';
import { ArrowUpIcon } from '@heroicons/react/20/solid';
import { useDebouncedCallback } from 'use-debounce';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { OrganizationContext } from '@/app/dashboard/activeOrganizationProvider';

const filters = {
  users: [
    { value: 'admin', label: 'admin', checked: false },
    { value: 'owner', label: 'owner', checked: false },
    { value: 'customer', label: 'customer', checked: false },
    { value: 'agent', label: 'agent', checked: false },
  ],
};

export default function Agents({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const emptyArray: Array<any> = [];
  let allUsers: any = null;
  const [users, setUsers] = useState(emptyArray);
  const [allFetchedUsers, setAllUsers] = useState(emptyArray);
  const [allPages, setAllPages] = useState(0);
  const [filterUserRole, setFilterUserRole] = useState('');
  const session = useSession();
  const pathname = usePathname();
  const { replace } = useRouter();

  // context might replace the all url-state stuff
  const activeOrg = useContext(OrganizationContext)?.organizationId;

  let initialEmails: string[] = [];

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [isEmailDialogOpen, openEmailDialog] = useState(false);
  const [emailInvitations, setEmailInvitations] = useState(initialEmails);

  const handleUserRoleUpdate = useDebouncedCallback((value: string) => {
    if (value) {
      params.set('role', value);
    } else {
      params.delete('role');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    const fetchData = async () => {
      allUsers = await fetchAgents(activeOrg, query, currentPage);
      setUsers(allUsers.users);
      setAllUsers(allUsers.allUsers);
      setAllPages(allUsers.totalUsers);
      console.log(allFetchedUsers);
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });

    params.set('role', filterUserRole);
  }, [activeOrg, query, currentPage, filterUserRole]);

  const openDialog = () => {
    openEmailDialog(true);
  };

  const handleDataFromInvitationDialog = (data: string[]) => {
    setEmailInvitations(data);
  };

  return (
    <>
      <SimpleSearchAgent
        open={isEmailDialogOpen}
        parentCallBack={handleDataFromInvitationDialog}
        close={() => openEmailDialog(false)}
      />
      <div className="bg-white flex justify-between">
        {/* Filters */}
        <Disclosure
          as="section"
          aria-labelledby="filter-heading"
          className="grid items-center border-gray-200"
        >
          <h2 id="filter-heading" className="sr-only">
            Filters
          </h2>
          <div className="relative col-start-1 row-start-1 py-10">
            <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 text-sm">
              <div>
                <Disclosure.Button className="group flex items-center font-medium text-gray-700">
                  <FunnelIcon
                    className="mr-2 h-5 w-5 flex-none text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  2 Filters
                </Disclosure.Button>
              </div>
              <div className="pl-6">
                <div className="col-start-1 row-start-1">
                  <div className="mx-auto flex max-w-7xl justify-end  ">
                    <Menu as="div" className="relative inline-block">
                      <UserSearch placeholder="search for user..." />
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="py-8">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
              <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Users</legend>
                  <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                    {filters.users.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          id={`price-${optionIdx}`}
                          onChange={(e) => {
                            handleUserRoleUpdate(e.target.value);
                          }}
                          name="price[]"
                          defaultValue={option.value}
                          type="checkbox"
                          className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          defaultChecked={option.checked}
                        />
                        <label
                          htmlFor={`price-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </Disclosure.Panel>
        </Disclosure>
        {allFetchedUsers.filter(
          (agent) =>
            agent.id === session.data?.user?.id && agent.role_name === 'owner',
        ).length !== 0 && (
          <div className="col-start-1 row-start-1 py-10">
            <div className="mx-auto flex max-w-7xl justify-end">
              <button
                onClick={() => openDialog()}
                type="button"
                className="inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <ArrowUpIcon
                  className="-ml-0.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                agents.csv
              </button>

              <Link
                href="/dashboard/agents/new"
                className="ml-3 cursor-pointer inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add agent
              </Link>
            </div>
          </div>
        )}
      </div>
      <Suspense fallback={<UserSkeleton />}>
        <GetAgentsData agents={users} allUsers={allFetchedUsers} />
      </Suspense>
      <div className="flex justify-center">
        <Pagination totalPages={allPages} />
      </div>
    </>
  );
}
