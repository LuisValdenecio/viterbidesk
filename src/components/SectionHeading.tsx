'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

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

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const SectionHeading: React.FC<{
  tabs: TabArray;
  btnAndLink?: BtnAndLink;
  mainTitle?: MainTitle;
}> = ({ tabs, mainTitle }) => {
  const pathname = usePathname();

  return (
    <>
      <div className="relative border-b border-gray-200 pb-5 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          {mainTitle && (
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              {mainTitle.title}
            </h1>
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
