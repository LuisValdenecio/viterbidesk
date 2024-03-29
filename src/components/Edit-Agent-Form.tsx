'use client';

import { updateAgent } from '@/app/lib/actions';
import { Metadata } from 'next';
import { fetchAgentById } from '@/lib/data';
import { notFound } from 'next/navigation';
//@ts-ignore
import { useFormState } from 'react-dom';
import { Agent } from '@/lib/definitions';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const metadata: Metadata = {
  title: 'Add Customer',
  description:
    'On this page, we’ll dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

export default function EditAgentForm({ agent }: { agent: Agent }) {
  const initialState = { message: null, errors: {} };
  const updateAgentWithId = updateAgent.bind(null, agent.id);
  const [state, dispatch] = useFormState(updateAgentWithId, initialState);

  return (
    <form action={dispatch}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name*
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={agent.name}
                  aria-describedby="name-error"
                />
              </div>

              <div
                className="flex h-8 items-end space-x-1"
                id="name-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.errors?.agentName &&
                  state.errors.agentName.map((error: string) => (
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

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address*
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={agent.email}
                  aria-describedby="email-error"
                />
              </div>
              <div
                className="flex h-8 items-end space-x-1"
                id="email-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.errors?.agentEmail &&
                  state.errors.agentEmail.map((error: string) => (
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

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Roles
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            We will always let you know about important changes, but you pick
            what else you want to hear about.
          </p>

          <div className="mt-5 space-y-10">
            <fieldset>
              <div
                className="flex h-8 items-end space-x-1"
                id="role-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.errors?.agentRole &&
                  state.errors.agentRole.map((error: string) => (
                    <>
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    </>
                  ))}
              </div>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="push-nothing"
                      name="role"
                      value="admin"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      defaultChecked={agent.role_name === 'owner'}
                      aria-describedby="role-error"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="font-medium text-gray-900"
                    >
                      Owner
                    </label>
                    <p className="text-gray-500">
                      System administrators have full access to configure
                      settings and manage all roles.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="push-nothing"
                      name="role"
                      value="staff"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      defaultChecked={agent.role_name === 'admin'}
                      aria-describedby="role-error"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="offers"
                      className="font-medium text-gray-900"
                    >
                      Admin
                    </label>
                    <p className="text-gray-500">
                      Get notified when a candidate accepts or rejects an offer.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="push-nothing"
                      name="role"
                      value="team-lead"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      defaultChecked={agent.role_name === 'agent'}
                      aria-describedby="role-error"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="offers"
                      className="font-medium text-gray-900"
                    >
                      Agent
                    </label>
                    <p className="text-gray-500">
                      Get notified when a candidate accepts or rejects an offer.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
