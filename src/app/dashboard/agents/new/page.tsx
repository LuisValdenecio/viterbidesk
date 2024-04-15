'use client';

import { createAgent } from '@/app/lib/actions';
import { h2 } from '@/components/mdx';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

//@ts-ignore
import { useFormState } from 'react-dom';
import { Metadata } from 'next';
import { useFormStatus } from 'react-dom';
import { useContext, useEffect, useState } from 'react';
import EmailSentDialog from '@/components/EmailSentDialog';
import EmailSendingFailedDialog from '@/components/EmailSendingFailedDialog';
import EmailRepeatedOnTheDb from '@/components/EmailRepeatedDialog';
import { OrganizationContext } from '../../activeOrganizationProvider';

const metadata: Metadata = {
  title: 'Add Customer',
  description:
    'On this page, we’ll dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

function Submit({ parentCllback }: { parentCllback: Function }) {
  const { pending } = useFormStatus();
  parentCllback(pending);
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {pending ? 'Sending...' : 'Save'}
    </button>
  );
}

export default function Page() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createAgent, initialState);
  const [pendingFormState, setPendingState] = useState(false);
  const [showRepeatedEmail, setRepeatedEmail] = useState(false);
  const [showSuccessEmailDialog, setSuccessfulEmailSentDialog] =
    useState(false);
  const [showFailureEmailDialog, setFailureEmailDialog] = useState(false);

  const handlePendingFormState = (childData: boolean) => {
    setPendingState(childData);
  };

  const activeOrgId = useContext(OrganizationContext)?.organizationId;

  useEffect(() => {
    console.log(state);
    if (state.message && state.emailResult?.message === 'Email was delivered') {
      setSuccessfulEmailSentDialog(true);
    } else {
      setSuccessfulEmailSentDialog(false);
    }

    if (
      state.message &&
      state.message === 'All fields are valid' &&
      state.emailResult?.code === 500
    ) {
      setFailureEmailDialog(true);
    } else {
      setFailureEmailDialog(false);
    }

    if (
      state.message &&
      state.message === 'Email already exists on the system'
    ) {
      setRepeatedEmail(true);
    } else {
      setRepeatedEmail(false);
    }
  }, [pendingFormState, state]);

  return (
    <>
      <form action={dispatch}>
        {showSuccessEmailDialog && (
          <EmailSentDialog openValue={showSuccessEmailDialog} />
        )}

        {showFailureEmailDialog && (
          <EmailSendingFailedDialog openValue={showFailureEmailDialog} />
        )}

        {showRepeatedEmail && (
          <EmailRepeatedOnTheDb openValue={showRepeatedEmail} />
        )}

        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400"
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
                    aria-describedby="email-error"
                  />
                </div>
                <div
                  className="flex h-8 items-end space-x-1"
                  id="email-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state.errors?.userEmail &&
                    state.errors.userEmail.map((error: string) => (
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
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400">
              Roles
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
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
                  {state.errors?.userRole &&
                    state.errors.userRole.map((error: string) => (
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
                        value="owner"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        aria-describedby="role-error"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="comments"
                        className="font-medium text-gray-900 dark:text-gray-400"
                      >
                        Owner
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        System administrators have full access to configure
                        settings and manage all roles.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-x-3 hidden">
                    <div className="flex h-6 items-center">
                      <input name="org_id" value={activeOrgId} />
                    </div>
                  </div>

                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="push-nothing"
                        name="role"
                        value="admin"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        aria-describedby="role-error"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="offers"
                        className="font-medium text-gray-900 dark:text-gray-400"
                      >
                        Admin
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Get notified when a candidate accepts or rejects an
                        offer.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="push-nothing"
                        name="role"
                        value="agent"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        aria-describedby="role-error"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="offers"
                        className="font-medium text-gray-900 dark:text-gray-400"
                      >
                        Agent
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Get notified when a candidate accepts or rejects an
                        offer.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="push-nothing"
                        name="role"
                        value="customer"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        aria-describedby="role-error"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="offers"
                        className="font-medium text-gray-900 dark:text-gray-400"
                      >
                        Customer
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Get notified when a candidate accepts or rejects an
                        offer.
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
          <Submit parentCllback={handlePendingFormState} />
        </div>
      </form>
    </>
  );
}
