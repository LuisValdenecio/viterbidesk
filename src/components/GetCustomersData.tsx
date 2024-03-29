'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Customer } from '@/lib/definitions';
import Link from 'next/link';
import DeleteModal from '@/components/AlertDialog';
import { UserCircleIcon } from '@heroicons/react/24/outline';

type Customers_data = Customer[];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const GetCustomersData: React.FC<{
  customers: Customers_data;
}> = ({ customers }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [agentId, setagentId] = useState('');

  const openDialog = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => {
    setIsDialogOpen(true);
    setagentId(id);
  };

  return (
    <>
      <DeleteModal
        open={isDialogOpen}
        agentId={agentId}
        userType="Customer"
        close={() => setIsDialogOpen(false)}
      />
      <ul role="list" className="divide-y divide-gray-100">
        {customers.map((customer) => (
          <li
            key={customer.email}
            className="flex justify-between gap-x-6 py-4"
          >
            <div className="flex min-w-0 gap-x-4">
              <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                <svg
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                  <a href="/" className="hover:underline">
                    {customer.name}
                  </a>
                </p>
                <p className="mt-1 flex text-xs leading-5 text-gray-500 dark:text-white">
                  <a
                    href={`mailto:${customer.email}`}
                    className="truncate hover:underline"
                  >
                    {customer.email}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-6">
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
                          View profile
                          <span className="sr-only">, {customer.name}</span>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`/dashboard/admin/customers/${customer.id}/edit`}
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900',
                          )}
                        >
                          Edit Profile
                          <span className="sr-only">, {customer.name}</span>
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={(event) => openDialog(event, customer.id)}
                          className={classNames(
                            'cursor-pointer',
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900',
                          )}
                        >
                          Delete
                          <span className="sr-only">,{customer.name}</span>
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
    </>
  );
};

export default GetCustomersData;
