'use client';

import { Fragment, useEffect, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import {
  BuildingLibraryIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';
import {
  BookmarkSquareIcon,
  CalendarDaysIcon,
  LifebuoyIcon,
} from '@heroicons/react/24/outline';
import { fetchOrganizations } from '@/lib/data';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { organizationStore } from '@/store/organization';
import { ArrowDownIcon } from '@heroicons/react/24/solid';

const recentPosts = [
  {
    id: 1,
    title: 'Boost your conversion rate',
    href: '#',
    date: 'Mar 5, 2023',
    datetime: '2023-03-05',
  },
];

export default function SignedInUser() {
  const emptyArray: Array<any> = [];
  let organizations: Array<any> = [];
  const setActiveOrg = organizationStore((state: any) => state.setActiveOrg);

  const [data, setData] = useState([emptyArray]);
  const activeOrgId = organizationStore(
    (state: any) => state.activeOrganizationId,
  );

  useEffect(() => {
    const fetchData = async () => {
      organizations = await fetchOrganizations();
      setData(organizations);
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });
  }, []);

  return (
    <div>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center gap-x-1 text-sm leading-6 text-gray-900">
          <button
            type="button"
            className="inline-flex items-center gap-x-1 rounded-md bg-gray-600 px-2 py-0.5 text-sm  text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Organizations
            <ArrowDownIcon className="-mr-0.4 h-4 w-4" aria-hidden="true" />
          </button>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
              <div className="p-4">
                {data.map((item) => (
                  <div
                    className="cursor-pointer"
                    onClick={() => setActiveOrg(item.id)}
                  >
                    <div className="rounded-lg p-4 flex justify-between hover:bg-gray-50 cursor-pointer">
                      <div
                        key={item.name}
                        className="group relative flex gap-x-6"
                      >
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <BuildingLibraryIcon
                            className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">
                            {item.name}
                            <span className="absolute inset-0" />
                          </span>
                          <p className="mt-1 text-gray-600">
                            short description
                          </p>
                        </div>
                      </div>

                      {item.id === activeOrgId && (
                        <div className="mt-1 flex h-11 w-11 flex-none items-start rounded-l mr-2">
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-small text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="">
                  <div className="group relative flex gap-x-6 rounded-lg p-4 items-center hover:bg-gray-50 cursor-pointer">
                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <PlusCircleIcon
                        className="h-6 w-6 text-indigo-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <Link
                        href="/organizations/new"
                        className="font-semibold text-gray-900"
                      >
                        Create a new Organization
                        <span className="absolute inset-0" />
                      </Link>
                      <p className="mt-1 text-gray-600">short description</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8">
                <div className="flex justify-between">
                  <h3 className="text-sm font-semibold leading-6 text-gray-500">
                    Recent posts
                  </h3>
                  <a
                    href="#"
                    className="text-sm font-semibold leading-6 text-indigo-600"
                  >
                    See all <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
                <ul role="list" className="mt-6 space-y-6">
                  {recentPosts.map((post) => (
                    <li key={post.id} className="relative">
                      <time
                        dateTime={post.datetime}
                        className="block text-xs leading-6 text-gray-600"
                      >
                        {post.date}
                      </time>
                      <a
                        href={post.href}
                        className="block truncate text-sm font-semibold leading-6 text-gray-900"
                      >
                        {post.title}
                        <span className="absolute inset-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}
