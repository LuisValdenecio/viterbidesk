'use client';

import { ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  CalendarIcon,
  CommandLineIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { OrganizationContext } from '@/app/dashboard/activeOrganizationProvider';
import { useState, useContext, useEffect } from 'react';
import { fetchTopics } from '@/lib/data';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Topics() {
  const emptyArray: Array<any> = [];
  let allTopics: any = null;
  const [topics, setTopics] = useState(emptyArray);
  const activeOrg = useContext(OrganizationContext)?.organizationId;

  useEffect(() => {
    const fetchData = async () => {
      allTopics = await fetchTopics(activeOrg);
      setTopics(allTopics);
      console.log(allTopics);
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });
  }, [activeOrg]);

  return (
    <div className="mx-auto mt-6">
      <ul role="list" className="mt-6 divide-y divide-gray-200 border-b">
        {topics.map((item, itemIdx) => (
          <li key={itemIdx}>
            <div className="group relative flex items-start space-x-3 py-4">
              <div className="flex-shrink-0">
                <span
                  className={classNames(
                    'bg-purple-500',
                    'inline-flex h-10 w-10 items-center justify-center rounded-lg',
                  )}
                >
                  <MegaphoneIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  <a href={'#'}>
                    <span className="absolute inset-0" aria-hidden="true" />
                    {item.name}
                  </a>
                </div>
                <p className="text-sm text-gray-500">{item.about}</p>
              </div>
              <div className="flex-shrink-0 self-center">
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex">
        <a
          href="#"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Or start from an empty project
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
    </div>
  );
}
