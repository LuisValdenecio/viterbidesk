import Pagination from '@/components/Pagination';
import UserSearch from '@/components/UserSearch';
import { CheckBadgeIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  BookmarkSquareIcon,
  BookOpenIcon,
  QueueListIcon,
  RssIcon,
} from '@heroicons/react/24/solid';
import { fetchOrganizations } from '@/lib/data';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <Organizations />
    </>
  );
}

function Search() {
  return (
    <>
      <form className="mx-auto w-full max-w-7xl ">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search organizations..."
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
    </>
  );
}

async function Organizations() {
  const orgsHeIsIn: any = await fetchOrganizations();
  console.log(orgsHeIsIn);

  return (
    <div className="bg-white border max-auto w-full">
      <div className="flex p-9 justify-between">
        <div className=""></div>
        <div className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-24 lg:px-8">
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">Popular pages</h2>
          <ul role="list" className=" divide-gray-100">
            <li className="relative flex gap-x-6 py-6">
              <Search />
            </li>

            {orgsHeIsIn.map((link: any, index: number) => (
              <li key={index} className="relative flex gap-x-6 py-4">
                <div className="flex h-10 w-10 flex-none items-center justif4y-center">
                  <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    <Link href={`dashboard/organization?id=${link.id}`}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {link.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {link.role_name}
                  </p>
                </div>
                {false && (
                  <div className="flex-none self-center">
                    <CheckBadgeIcon
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center">
            <Link
              href={'/dashboard/organizations/'}
              className="text-sm font-semibold leading-6 text-indigo-600"
            >
              <span aria-hidden="true">&larr; </span>
              Create an organization
            </Link>
          </div>
        </div>

        <div className="flex justify-center mx-auto mt-12">
          <Pagination totalPages={5} />
        </div>
      </main>
    </div>
  );
}
