'use client';

import { createOrganization } from '@/app/lib/actions';
//@ts-ignore
import { useFormState } from 'react-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { SessionProvider, useSession } from 'next-auth/react';

export function OrgForm() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createOrganization, initialState);

  return (
    <form action={dispatch}>
      <div className="space-y-12">
        <div className="">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                organization name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  aria-describedby="name-error"
                />
              </div>

              <div
                className="flex h-8 items-end space-x-1"
                id="name-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.errors?.organizationName &&
                  state.errors.organizationName.map((error: string) => (
                    <>
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default function Page() {
  const { data: session, status } = useSession();

  return (
    <>
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        create an organization
        <span>{session?.user?.email}</span>
      </h2>
      <OrgForm />
    </>
  );
}
