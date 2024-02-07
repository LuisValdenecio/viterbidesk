'use client';

import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import UserSearch from '@/components/UserSearch';

const filters = {
  users: [
    { value: 'admin', label: 'admin', checked: false },
    { value: 'owner', label: 'owner', checked: false },
    { value: 'customer', label: 'customer', checked: false },
    { value: 'agent', label: 'agent', checked: false },
  ],
};

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Filter() {
  return (
    <div className="bg-white">
      {/* Filters */}
      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="grid items-center border-gray-200"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 py-2">
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
              <button type="button" className="text-gray-500">
                Clear all
              </button>
            </div>
          </div>
        </div>
        <Disclosure.Panel className="border-t border-gray-200 py-10">
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
        <div className="col-start-1 row-start-1 py-4">
          <div className="mx-auto flex max-w-7xl justify-end  ">
            <Menu as="div" className="relative inline-block">
              <UserSearch placeholder="search for user..." />
            </Menu>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}
