'use client';

import { Menu } from '@headlessui/react';
import {
  CheckBadgeIcon,
  EllipsisVerticalIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid';
import { Agent } from '@/lib/definitions';
import Link from 'next/link';

import React, { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import DeleteModal from '@/components/AlertDialog';
import { resendInvitation } from '@/app/lib/actions';
import EmailResendDialog from './EmailResentDialog';
import EmailResendFailedDialog from './EmailResendFailedDialog';
import { Progress } from 'rsup-progress';
import { useSession } from 'next-auth/react';

const progress = new Progress({
  height: 3,
  color: 'linear-gradient(to right, #00f260, #0575e6)',
});

type agent_data = Agent[];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const GetAgentsData: React.FC<{
  agents: agent_data;
  allUsers: agent_data;
}> = ({ agents, allUsers }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [agentId, setagentId] = useState('');
  const [showFailedResendlDialog, setResendFailedDialog] = useState(false);
  const session = useSession();

  const [showSuccessEmailDialog, setSuccessfulEmailSentDialog] =
    useState(false);

  async function resendInvitationFn(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    userId: string,
  ) {
    progress.start();
    const result = await resendInvitation(userId).then((res) => {
      progress.end();

      if (res?.message === 'Email resent sucessfully') {
        setSuccessfulEmailSentDialog(true);
      }

      if (res?.message === 'Email was not delivered') {
        setResendFailedDialog(true);
      }
    });
  }

  const openDialog = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => {
    setIsDialogOpen(true);
    setagentId(id);
  };

  return (
    <>
      <DeleteModal
        open={isDialogOpen}
        agentId={agentId}
        userType="Agent"
        close={() => setIsDialogOpen(false)}
      />

      <EmailResendDialog
        open={showSuccessEmailDialog}
        close={() => setSuccessfulEmailSentDialog(false)}
      />

      <EmailResendFailedDialog
        open={showFailedResendlDialog}
        close={() => setResendFailedDialog(false)}
      />

      {agents.length === 0 && (
        <div className="px-6 py-14 text-center text-sm sm:px-14">
          <ExclamationCircleIcon
            type="outline"
            name="exclamation-circle"
            className="mx-auto h-6 w-6 text-gray-400"
          />
          <p className="mt-4 font-semibold text-gray-900">No results found</p>
          <p className="mt-2 mb-4 text-gray-500">
            No logs found for this organisation.
          </p>
          <Link
            href="/dashboard/agents"
            className="rounded bg-indigo-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            dashboard
          </Link>
        </div>
      )}

      <ul role="list" className="divide-y divide-gray-100">
        {agents.map((agent) => (
          <li key={agent.email} className="flex justify-between gap-x-6 py-4">
            <div className="flex min-w-0 gap-x-4">
              {!agent.img && (
                <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              )}

              {agent.img && (
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={agent.img}
                  alt=""
                />
              )}

              <div className="min-w-0 flex-auto">
                <p className="text-sm  text-gray-900">
                  {agent.name && (
                    <a href="/" className="hover:underline">
                      {agent.name}
                    </a>
                  )}

                  {agent.email_sent && !agent.name && (
                    <div className="flex text-sm">
                      <span className="group inline-flex items-center text-gray-500 hover:text-gray-900">
                        <CheckBadgeIcon
                          className="h-5 w-5 text-green-400 "
                          aria-hidden="true"
                        />
                        <span className="ml-1 text-green-400">
                          Invitation sent
                        </span>
                      </span>
                    </div>
                  )}

                  {!agent.email_sent && agent.role_name !== 'owner' && (
                    <div className="flex text-sm">
                      <span className="group inline-flex items-center text-gray-500 hover:text-gray-900">
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-orange-400 "
                          aria-hidden="true"
                        />
                        <span className="ml-2 text-orange-400">
                          Invitation failed
                        </span>
                      </span>
                    </div>
                  )}
                </p>
                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                  <a
                    href={`mailto:${agent.email}`}
                    className="truncate hover:underline"
                  >
                    {agent.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-x-6">
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {true && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/dashboard/agents/${agent.id}`}
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900',
                            )}
                          >
                            View profile
                            <span className="sr-only">, {agent.name}</span>
                          </Link>
                        )}
                      </Menu.Item>
                    )}

                    {allUsers.filter(
                      (agent) =>
                        agent.id === session.data?.user?.id &&
                        agent.role_name === 'owner',
                    ).length !== 0 &&
                      !agent.name && (
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={async (event) =>
                                await resendInvitationFn(event, agent.id)
                              }
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900',
                              )}
                            >
                              Re-invite
                              <span className="sr-only">, {agent.name}</span>
                            </a>
                          )}
                        </Menu.Item>
                      )}

                    {allUsers.filter(
                      (agent) =>
                        agent.id === session.data?.user?.id &&
                        agent.role_name === 'owner',
                    ).length !== 0 && (
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={(event) => openDialog(event, agent.id)}
                            className={classNames(
                              'cursor-pointer',
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900',
                            )}
                          >
                            Delete
                            <span className="sr-only">, {agent.name}</span>
                          </a>
                        )}
                      </Menu.Item>
                    )}

                    {agent.name && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900',
                            )}
                          >
                            Chat
                            <span className="sr-only">, {agent.name}</span>
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default GetAgentsData;
