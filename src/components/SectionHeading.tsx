'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ArrowUpIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import SimpleSearchAgent from '@/components/SimpleSearchAgent';

interface Tab {
  name: string;
  href: string;
}

interface BtnAndLink {
  buttonLabel: string;
  link: {
    label: string;
    url: string;
  };
}

interface MainTitle {
  title: string;
}

type TabArray = Tab[];
let initialEmails: string[] = [];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const SectionHeading: React.FC<{
  tabs: TabArray;
  btnAndLink?: BtnAndLink;
  mainTitle?: MainTitle;
}> = ({ tabs, btnAndLink, mainTitle }) => {
  const pathname = usePathname();

  const [isEmailDialogOpen, openEmailDialog] = useState(false);
  const [emailInvitations, setEmailInvitations] = useState(initialEmails);

  const openDialog = () => {
    openEmailDialog(true);
  };

  const handleDataFromInvitationDialog = (data: string[]) => {
    console.log(data);
    setEmailInvitations(data);
  };

  return (
    <>
      <SimpleSearchAgent
        open={isEmailDialogOpen}
        parentCallBack={handleDataFromInvitationDialog}
        close={() => openEmailDialog(false)}
      />
      <div className="relative border-b border-gray-200 pb-5 sm:pb-0">
        {}
        <div className="md:flex md:items-center md:justify-between">
          {mainTitle && (
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {mainTitle.title}
            </h3>
          )}

          {btnAndLink && (
            <div className="mt-3 flex md:absolute md:right-0 md:top-3 md:mt-0">
              <button
                onClick={() => openDialog()}
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <ArrowUpIcon
                  className="-ml-0.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {btnAndLink.buttonLabel}
              </button>

              <Link
                href={btnAndLink?.link.url}
                className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {btnAndLink.link.label}
              </Link>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="current-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="current-tab"
              name="current-tab"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-4">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={clsx(
                    'whitespace-nowrap border-b-2 px-1 pb-4 text-sm ',
                    {
                      'border-indigo-500 text-indigo-600':
                        pathname === tab.href,
                      'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-white':
                        pathname !== tab.href,
                    },
                  )}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionHeading;
