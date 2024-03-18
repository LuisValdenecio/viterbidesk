'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { useEffect, useContext, useState } from 'react';
import Pagination from './Pagination';
import { OrganizationContext } from '@/app/dashboard/activeOrganizationProvider';
import { format } from 'date-fns';
import { fetchUserLogs } from '@/lib/data';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function HistoryEntry({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const activeOrg = useContext(OrganizationContext);
  const emptyArray: Array<any> = [];
  const [userLogs, setUserLogs] = useState(emptyArray);
  const [allPages, setAllPages] = useState(0);

  useEffect(() => {
    const isOwner = async () => {
      const allLogs = await fetchUserLogs(
        activeOrg.organizationId,
        query,
        currentPage,
      );
      setUserLogs(allLogs.userLogs);
      setAllPages(allLogs.totalUserLogs);
    };

    isOwner().catch((e) => {
      console.error('An error occured while fetching the data');
    });
  }, [activeOrg, query, currentPage]);

  return (
    <div>
      {userLogs.length === 0 && (
        <div className="px-6 py-14 text-center text-sm sm:px-14">
          <ExclamationCircleIcon
            type="outline"
            name="exclamation-circle"
            className="mx-auto h-6 w-6 text-gray-400"
          />
          <p className="mt-4 font-semibold text-gray-900">No results found</p>
          <p className="mt-2 mb-4 text-gray-500">
            No logs found for this organisation.
          </p>
          <Link
            href="/dashboard/agents"
            className="rounded bg-indigo-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            dashboard
          </Link>
        </div>
      )}

      <ul role="list" className="divide-y divide-gray-100 mt-4">
        {userLogs.map((log) => (
          <li
            key={log.id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  The user {log.user_subject} was deleted
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  On{' '}
                  <time dateTime={log.createdAt.toString()}>
                    {format(log.createdAt, 'yyyy-MM-dd')}
                  </time>
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className="truncate">executed by {log.user_acted_name}</p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900',
                          )}
                        >
                          Recover <span className="sr-only">, Recover</span>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900',
                          )}
                        >
                          See details<span className="sr-only">Details</span>
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <Pagination totalPages={allPages} />
      </div>
    </div>
  );
}
