'use client';

import { Fragment, useState } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/20/solid';
import {
  UsersIcon,
  UserCircleIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import FriendlyAlert from '../components/FriendlyAlert';
import { scheduleEmailInvitation } from '../app/lib/actions';
import { organizationStore } from '@/store/organization';
import { useRef, useEffect } from 'react';
import { z } from 'zod';
import Papa from 'papaparse';

const recent = [];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

let invitations = [];

const InviteeEmailSchema = z.string().email();

export default function SimpleSearchAgent({ open, close, parentCallBack }) {
  const [query, setQuery] = useState('');
  const [numbOfInvitations, setInvitations] = useState(invitations.length);
  const [filteredinvitations, setFilteredInvitations] = useState(invitations);
  const [newEmailInputField, setNewEmailInputField] = useState('');
  const [inviteeEmailInputField, setInviteeEmailInputField] = useState('');
  const activeOrganizationId = organizationStore(
    (state) => state.activeOrganizationId,
  );
  const [activeOrgId, setActiveOrgId] = useState(activeOrganizationId);

  useEffect(() => {
    setActiveOrgId(activeOrganizationId);
  }, [activeOrganizationId]);

  const csvInputRef = useRef(null);

  const pages = [
    { name: 'Projects', href: '#', current: false },
    { name: 'Project Nero', href: '#', current: true },
  ];
  //const [open, setOpen] = useState(true)

  const revokeInvitation = (email) => {
    let index = invitations.indexOf(email);
    invitations.splice(index, 1);
    setInvitations(invitations.length);
    setQuery('');
  };

  const handleCsvClick = () => {
    csvInputRef.current.click();
  };

  const handleCvsFileChange = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result) {
        result.data.map((data) => {
          let email = data.email;
          if (
            InviteeEmailSchema.safeParse(email).success &&
            invitations.indexOf(email) === -1
          )
            invitations.push(email);
        });
        setFilteredInvitations(invitations);
        setInvitations(invitations.length);
      },
    });
    console.log(invitations);
  };

  const handleNewEmailInputField = (event) => {
    setNewEmailInputField(event.target.value);
  };

  const handleInviteeEmailInputField = (event) => {
    setInviteeEmailInputField(event.target.value);
  };

  const revokeAllInvitations = () => {
    invitations = [];
    setInvitations(invitations.length);
    setFilteredInvitations(invitations);
    setQuery('');
  };

  const handleSubmitEmailEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let oldEmail = formData.get('old-email');
    let newEmail = formData.get('new-email');
    let index = invitations.indexOf(oldEmail);
    const status = InviteeEmailSchema.safeParse(newEmail);

    if (status.success && invitations.indexOf(newEmail) === -1) {
      invitations[index] = newEmail;
      setInvitations(invitations.length);
      setFilteredInvitations(invitations);
      setQuery(newEmail);
      setNewEmailInputField('');
    }
  };

  const onCloseDialogWindow = () => {
    parentCallBack(invitations);
    close();
  };

  const sendEmailInvitation = () => {
    scheduleEmailInvitation(invitations, activeOrgId);
    close();
  };

  const handleQueryChange = (qryValue) => {
    setQuery(qryValue);
    setFilteredInvitations(
      qryValue === ''
        ? invitations
        : invitations.filter((invitation) => {
            return invitation.toLowerCase().includes(qryValue.toLowerCase());
          }),
    );
  };

  const handleInvitationForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let email = formData.get('email');
    const status = InviteeEmailSchema.safeParse(email);

    if (status.success && invitations.indexOf(email) === -1) {
      invitations.push(email);
      setInvitations(invitations.length);
    }
    setInviteeEmailInputField('');
  };
  /*
  const filteredinvitations =
    query === ''
      ? invitations
      : invitations.filter((invitation) => {
          return invitation.toLowerCase().includes(query.toLowerCase())
        })
        */

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => setQuery('')}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={onCloseDialogWindow}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox
                onChange={(invitation) =>
                  (window.location = invitation.profileUrl)
                }
              >
                {({ activeOption }) => (
                  <>
                    <div className="relative">
                      <MagnifyingGlassIcon
                        className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <Combobox.Input
                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                        placeholder="Search..."
                        onChange={(event) =>
                          handleQueryChange(event.target.value)
                        }
                      />
                    </div>

                    {(query === '' || filteredinvitations.length > 0) && (
                      <Combobox.Options
                        as="div"
                        static
                        hold
                        className="flex transform-gpu divide-x divide-gray-100"
                      >
                        <div
                          className={classNames(
                            'max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4',
                            activeOption && 'sm:h-96',
                          )}
                        >
                          <form onSubmit={handleInvitationForm}>
                            <div className="-mx-2 mb-4 flex gap-1">
                              <label htmlFor="email" className="sr-only">
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="customer@example.com"
                                onChange={handleInviteeEmailInputField}
                                value={inviteeEmailInputField}
                              />
                              <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                {' '}
                                Invite
                              </button>
                              <button
                                type="button"
                                onClick={handleCsvClick}
                                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                {' '}
                                .csv
                                <input
                                  type="file"
                                  className="hidden"
                                  ref={csvInputRef}
                                  onChange={(e) => {
                                    handleCvsFileChange(e);
                                    e.target.value = null;
                                  }}
                                  accept=".csv"
                                />
                              </button>
                            </div>
                          </form>

                          {numbOfInvitations !== 0 && (
                            <nav
                              nav
                              className="-mx-2 flex rounded-md bg-gray-100 bg-opacity-50 p-2 text-gray-900"
                              aria-label="Breadcrumb"
                            >
                              <ol
                                role="list"
                                className="flex items-center  space-x-4"
                              >
                                <li>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      revokeAllInvitations({ invitations })
                                    }
                                    className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  >
                                    <TrashIcon
                                      className="-ml-0.5 h-5 w-5"
                                      aria-hidden="true"
                                    />
                                    Revoke all
                                  </button>
                                </li>
                                <li>
                                  <div className="flex items-center">
                                    <svg
                                      className="h-5 w-5 flex-shrink-0 text-gray-300"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      aria-hidden="true"
                                    >
                                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                    </svg>
                                    <a
                                      href="/"
                                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                    >
                                      Invitations ({numbOfInvitations})
                                    </a>
                                  </div>
                                </li>
                              </ol>
                            </nav>
                          )}

                          {numbOfInvitations !== 0 && (
                            <div className="-mx-2 text-sm text-gray-700">
                              {filteredinvitations.map((invitation) => (
                                <Combobox.Option
                                  as="div"
                                  key={invitation.id}
                                  value={invitation}
                                  className={({ active }) =>
                                    classNames(
                                      'flex cursor-default select-none items-center rounded-md p-2',
                                      active && 'bg-gray-100 text-gray-900',
                                    )
                                  }
                                >
                                  {({ active }) => (
                                    <>
                                      <UserCircleIcon
                                        className="h-7 w-7 text-gray-300"
                                        aria-hidden="true"
                                      />
                                      <span className="ml-3 flex-auto truncate">
                                        {invitation}
                                      </span>
                                      {active && (
                                        <ChevronRightIcon
                                          className="ml-3 h-5 w-5 flex-none text-gray-400"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </div>
                          )}
                        </div>

                        {(activeOption || filteredinvitations[0]) &&
                          numbOfInvitations !== 0 && (
                            <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                              <div className="flex-none p-6 text-center">
                                <UserCircleIcon
                                  className="h-12 w-12 text-gray-300"
                                  aria-hidden="true"
                                />
                                <h2 className="mt-3 font-semibold text-gray-900">
                                  Invite Code
                                </h2>
                                <p className="text-sm leading-6 text-gray-500">
                                  XOUL10JUU
                                </p>
                                <a
                                  href={`mailto:${
                                    activeOption || filteredinvitations[0]
                                  }`}
                                  className="text-indigo-600 underline"
                                >
                                  {activeOption || filteredinvitations[0]}
                                </a>
                              </div>
                              <form onSubmit={handleSubmitEmailEdit}>
                                <div className="flex flex-auto flex-col justify-between p-6">
                                  <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                                    <dd className="truncate">
                                      <div>
                                        <label
                                          htmlFor="email"
                                          className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                          New E-mail:
                                        </label>
                                        <div className="hidden">
                                          <input
                                            type="email"
                                            name="old-email"
                                            id="email"
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            defaultValue={activeOption}
                                          />
                                        </div>
                                        <div className="mt-1">
                                          <input
                                            type="email"
                                            name="new-email"
                                            id="email"
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="newemail@example.com"
                                            onChange={handleNewEmailInputField}
                                            value={newEmailInputField}
                                          />
                                        </div>
                                      </div>
                                    </dd>
                                  </dl>
                                  <div className="mt-2 flex gap-2">
                                    <button
                                      type="submit"
                                      className=" w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                      Alter Email
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        revokeInvitation(
                                          activeOption ||
                                            filteredinvitations[0],
                                        )
                                      }
                                      className=" w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                      Revoke
                                    </button>
                                    <button
                                      type="button"
                                      onClick={sendEmailInvitation}
                                      className=" w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                      Send
                                    </button>
                                  </div>

                                  <FriendlyAlert />
                                </div>
                              </form>
                            </div>
                          )}
                      </Combobox.Options>
                    )}

                    {query !== '' && filteredinvitations.length === 0 && (
                      <div className="px-6 py-14 text-center text-sm sm:px-14">
                        <UsersIcon
                          className="mx-auto h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                        <p className="mt-4 font-semibold text-gray-900">
                          This e-mail is not on the list
                        </p>
                        <p className="mt-2 text-gray-500">
                          We couldn’t find anything.
                        </p>
                      </div>
                    )}

                    {query === '' && numbOfInvitations === 0 && (
                      <div className="px-6 py-14 text-center text-sm sm:px-14">
                        <UsersIcon
                          className="mx-auto h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                        <p className="mt-4 font-semibold text-gray-900">
                          You haven't added any email yet
                        </p>
                        <p className="mt-2 text-gray-500">
                          Send numbOfInvitations by typing the email addresses
                          at the input above
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
