'use client';

import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Agent } from '@/lib/definitions';
import Link from 'next/link';

import React, { Fragment, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import DeleteModal from '@/components/AlertDialog';
import { resendInvitation } from '@/app/lib/actions';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import EmailResendDialog from './EmailResentDialog';
import EmailResendFailedDialog from './EmailResendFailedDialog';
import { Progress } from 'rsup-progress';

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
}> = ({ agents }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [agentId, setagentId] = useState('');
  const [showFailedResendlDialog, setResendFailedDialog] = useState(false);
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

      <ul role="list" className="divide-y divide-gray-100">
        {agents.map((agent) => (
          <li key={agent.email} className="flex justify-between gap-x-6 py-4">
            <div className="flex min-w-0 gap-x-4">
              <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                <svg
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {agent.name && (
                    <a href="/" className="hover:underline">
                      {agent.name}
                    </a>
                  )}

                  {agent.email_sent && !agent.name && (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Invitation sent
                    </span>
                  )}

                  {!agent.email_sent && agent.role_name !== 'owner' && (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      Invitation failed
                    </span>
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
                            View profile
                            <span className="sr-only">, {agent.name}</span>
                          </Link>
                        )}
                      </Menu.Item>
                    )}

                    {!agent.name && (
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
                          Delete<span className="sr-only">, {agent.name}</span>
                        </a>
                      )}
                    </Menu.Item>
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
