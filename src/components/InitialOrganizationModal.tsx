'use client';

import { Fragment, useState, useContext, useEffect } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import {
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import {
  ExclamationCircleIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { OrganizationContext } from '@/app/dashboard/activeOrganizationProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import { registerSignIn } from '@/app/lib/actions';

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function InitialOrganizationModal({ orgs }: { orgs: any }) {
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [openSelectOrgModal, setSelectOrgModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const selectOrgModal = params.get('select_org');
    if (selectOrgModal) {
      setSelectOrgModal(true);
    } else {
      setSelectOrgModal(false);
    }
  }, [params.get('select_org')]);

  const saveSignInHistoryLog = async (orgId: string) => {
    await registerSignIn(orgId);
  };

  // context might replace the all url-state stuff
  const activeOrg = useContext(OrganizationContext);

  const filteredItems =
    query === ''
      ? orgs
      : orgs.filter((item: any) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root
      show={openSelectOrgModal}
      as={Fragment}
      afterLeave={() => setQuery('')}
      appear
    >
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox>
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Select an organisation or search for one"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {filteredItems.length > 0 && (
                  <Combobox.Options
                    static
                    className="max-h-96 transform-gpu scroll-py-3 overflow-y-auto p-3"
                  >
                    {filteredItems.map((item, indx) => (
                      <Combobox.Option
                        key={item.id}
                        value={item}
                        onClick={() => {
                          activeOrg.setOrganizationId(item.id);
                          saveSignInHistoryLog(item.id);
                          router.push(`/dashboard/agents`);
                          router.refresh();
                        }}
                        className={({ active }) =>
                          classNames(
                            'flex cursor-pointer select-none rounded-xl p-3',
                            active && 'bg-gray-100',
                          )
                        }
                      >
                        {({ active }) => (
                          <>
                            <div
                              className={classNames(
                                'flex h-10 w-10 flex-none items-center justify-center rounded-lg',
                                'bg-indigo-500',
                              )}
                            >
                              <BuildingLibraryIcon
                                className="h-6 w-6 text-white"
                                aria-hidden="true"
                              />
                            </div>

                            <div className="ml-4 flex-auto">
                              <p
                                className={classNames(
                                  'text-sm font-medium',
                                  active ? 'text-gray-900' : 'text-gray-700',
                                )}
                              >
                                {item.name}
                              </p>
                              <p
                                className={classNames(
                                  'text-sm',
                                  active ? 'text-gray-700' : 'text-gray-500',
                                )}
                              >
                                {item.role_name}
                              </p>
                            </div>
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                    <Combobox.Option
                      key={crypto.randomUUID()}
                      className={({ active }) =>
                        classNames(
                          'flex cursor-pointer select-none rounded-xl p-3',
                          active && 'bg-gray-100',
                        )
                      }
                    >
                      <>
                        <div
                          className={classNames(
                            'flex h-10 w-10 flex-none items-center justify-center rounded-lg',
                            'bg-green-500',
                          )}
                        >
                          <PlusIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </div>

                        <div className="ml-4 flex-auto">
                          <p className="text-sm font-medium">
                            Add organization
                          </p>
                          <p className="text-gray-500">
                            create a new organization
                          </p>
                        </div>
                      </>
                    </Combobox.Option>
                  </Combobox.Options>
                )}

                {query !== '' && filteredItems.length === 0 && (
                  <div className="px-6 py-14 text-center text-sm sm:px-14">
                    <ExclamationCircleIcon
                      type="outline"
                      name="exclamation-circle"
                      className="mx-auto h-6 w-6 text-gray-400"
                    />
                    <p className="mt-4 font-semibold text-gray-900">
                      No results found
                    </p>
                    <p className="mt-2 mb-4 text-gray-500">
                      No organization found for this search term. Please try
                      again.
                    </p>
                    <Link
                      href="/organisation/new"
                      className="rounded bg-indigo-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      New organization
                    </Link>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
