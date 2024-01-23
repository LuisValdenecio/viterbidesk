'use client';

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  AtSymbolIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import SimpleSearch from '@/components/SimpleSearch';

export default function Page() {
  return (
    <>
      <h2 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl lg:text-4xl">
        Invite{' '}
        <span className="relative whitespace-nowrap text-blue-600">
          <svg
            aria-hidden="true"
            viewBox="0 0 418 42"
            className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
            preserveAspectRatio="none"
          >
            <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
          </svg>
          <span className="relative font-extrabold">Team members</span>
        </span>{' '}
      </h2>

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

      <div className="mx-auto mt-10 max-w-7xl">
        <div className="-mx-6 grid grid-cols-2 gap-2 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
          <Link href="/">
            <div className="bg-green-400/5 p-8 text-center sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="/icons/whatsapp-logo.svg"
                alt="Transistor"
                width={158}
                height={48}
              />
              <div className="flex items-center justify-center">
                <div>
                  <span>Whatsapp</span>
                </div>
                <div className="-end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 p-4 text-xs font-bold text-white dark:border-gray-900">
                  0
                </div>
              </div>
            </div>
          </Link>

          <Link href="/">
            <div className="bg-green-400/5 p-6 text-center sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="/icons/linkedin-logo.svg"
                alt="Reform"
                width={158}
                height={48}
              />
              <div className="flex items-center justify-center">
                <div>
                  <span>LinkedIn</span>
                </div>
                <div className="-end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 p-4 text-xs font-bold text-white dark:border-gray-900">
                  0
                </div>
              </div>
            </div>
          </Link>

          <div
            className="relative cursor-pointer bg-green-400/5 p-6  text-center sm:p-10"
            onClick={() => openDialog()}
          >
            <span className="sr-only">Notifications</span>

            <img
              className="max-h-12 w-full object-contain"
              src="/icons/at.svg"
              alt="Tuple"
              width={158}
              height={48}
            />
            <div className="flex items-center justify-center">
              <div>
                <span>E-mail</span>
              </div>
              <div className="-end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 p-4 text-xs font-bold text-white dark:border-gray-900">
                {emailInvitations.length}
              </div>
            </div>
          </div>

          <Link href="/">
            <div className="bg-green-400/5 p-6 text-center sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="/icons/instagram-logo.svg"
                alt="Laravel"
                width={158}
                height={48}
              />
              <div className="flex items-center justify-center">
                <div>
                  <span>Instagram</span>
                </div>
                <div className="-end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 p-4 text-xs font-bold text-white dark:border-gray-900">
                  0
                </div>
              </div>
            </div>
          </Link>

          <Link href="/">
            <div className="bg-green-400/5 p-6 text-center sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="/icons/discord-logo.svg"
                alt="SavvyCal"
                width={158}
                height={48}
              />
              <div className="flex items-center justify-center">
                <div>
                  <span>Discord</span>
                </div>
                <div className="-end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 p-4 text-xs font-bold text-white dark:border-gray-900">
                  0
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
