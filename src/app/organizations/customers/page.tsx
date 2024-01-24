'use client';

import {
  CheckCircleIcon,
  PhotoIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { RadioGroup } from '@headlessui/react';
import {
  AtSymbolIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import SimpleSearch from '@/components/SimpleSearch';
import { LinkIcon } from '@heroicons/react/20/solid';

const mailingLists = [
  {
    id: 1,
    title: 'Email',
    description: 'Last message sent an hour ago',
    users: '0',
  },
  {
    id: 2,
    title: 'Link',
    description: 'Last message sent 2 weeks ago',
    users: '1200 users',
  },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Page() {
  return (
    <>
      <SocialLinks />

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          skip
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </>
  );
}

let nextId = 0;
let initialEmails: { email: string }[] = [];

export function SocialLinks() {
  const [isEmailDialogOpen, openEmailDialog] = useState(false);
  const [isInviteesDialogOpen, openInviteesDialog] = useState(false);
  const [selectedMailingLists, setSelectedMailingLists] = useState(
    mailingLists[0],
  );

  const [emailInvitations, addEmailInvitation] = useState(initialEmails);

  const openDialog = () => {
    openEmailDialog(true);
  };

  const handleInvitationRequest = (email: string) => {
    addEmailInvitation([{ email: email }, ...emailInvitations]);
    console.log(emailInvitations);
  };

  const handleOpenInviteesDialog = (signal: boolean) => {
    openInviteesDialog(true);
  };

  return (
    <>
      <SimpleSearch
        open={isEmailDialogOpen}
        close={() => openEmailDialog(false)}
      />

      <RadioGroup
        value={selectedMailingLists}
        onChange={setSelectedMailingLists}
      >
        <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">
          Send Email Invitations
        </RadioGroup.Label>

        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
          <RadioGroup.Option
            key={1}
            value={1}
            onClick={() => openDialog()}
            className={({ active }) =>
              classNames(
                active
                  ? 'border-indigo-600 ring-2 ring-indigo-600'
                  : 'border-gray-300',
                'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none',
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Email
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      Send email invitations to agents
                    </RadioGroup.Description>
                    <RadioGroup.Description
                      as="span"
                      className="mt-6 text-sm font-medium text-gray-900"
                    >
                      0
                    </RadioGroup.Description>
                  </span>
                </span>
                <LinkIcon
                  className={classNames(
                    !checked ? 'invisible' : '',
                    'h-5 w-5 text-indigo-600',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={classNames(
                    active ? 'border' : 'border-2',
                    checked ? 'border-indigo-600' : 'border-transparent',
                    'pointer-events-none absolute -inset-px rounded-lg',
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>
    </>
  );
}
