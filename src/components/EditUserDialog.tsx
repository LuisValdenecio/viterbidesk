'use client';

import { deleteAgent, updateUserRole } from '../app/lib/actions';

import React, { Fragment, useContext, useRef, useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import { Dialog, Transition } from '@headlessui/react';
//@ts-ignore
import { useFormState } from 'react-dom';
import { OrganizationContext } from '@/app/dashboard/activeOrganizationProvider';

const EditUserDialog: React.FC<{
  open: boolean;
  close: any;
  agent: any;
}> = ({ open, close, agent }) => {
  const initialState = { message: null, errors: {} };

  console.log(agent);
  const updateAgentWithId = updateUserRole.bind(null, agent?.id);
  const [state, dispatch] = useFormState(updateAgentWithId, initialState);
  const activeOrgId = useContext(OrganizationContext)?.organizationId;

  console.log(state);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
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
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100  rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <div className="hidden w-full h-full flex-none flex-col divide-y divide-gray-100  sm:flex">
                <div className="flex-none p-6 text-center">
                  <img
                    src={agent?.img}
                    alt=""
                    className="mx-auto h-16 w-16 rounded-full"
                  />
                  <h2 className="mt-3 font-semibold text-gray-900">
                    {agent?.name}
                  </h2>
                  <p className="text-sm leading-6 text-gray-500">
                    current role: <i>{agent?.role_name}</i>
                  </p>
                </div>
                <div className="flex flex-auto flex-col justify-between p-6">
                  <form action={dispatch}>
                    <div className="space-y-12">
                      <div className="border-b border-gray-900/10 pb-12">
                        <div className=" space-y-10">
                          <fieldset>
                            <div
                              className="flex h-8 items-end space-x-1"
                              id="role-error"
                              aria-live="polite"
                              aria-atomic="true"
                            >
                              {state?.errors?.agentRole &&
                                state?.errors.agentRole.map((error: string) => (
                                  <>
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                    <p
                                      className=" text-sm text-red-500"
                                      key={error}
                                    >
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
                                    defaultChecked={
                                      agent?.role_name === 'owner'
                                    }
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
                                    System administrators have full access to
                                    configure.
                                  </p>
                                </div>
                              </div>

                              <div className="hidden">
                                <div className="">
                                  <input name="org_id" value={activeOrgId} />
                                </div>
                              </div>

                              <div className="hidden">
                                <div className="">
                                  <input name="user_name" value={agent?.name} />
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
                                    defaultChecked={
                                      agent?.role_name === 'admin'
                                    }
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
                                    Get notified when a candidate accepts or
                                    rejects an offer.
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
                                    defaultChecked={
                                      agent?.role_name === 'customer'
                                    }
                                    aria-describedby="role-error"
                                  />
                                </div>
                                <div className="text-sm leading-6">
                                  <label
                                    htmlFor="offers"
                                    className="font-medium text-gray-900"
                                  >
                                    Customer
                                  </label>
                                  <p className="text-gray-500">
                                    Get notified when a candidate accepts or
                                    rejects an offer.
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
                                    defaultChecked={
                                      agent?.role_name === 'agent'
                                    }
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
                                    Get notified when a candidate accepts or
                                    rejects an offer.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-x-6">
                      <button
                        type="submit"
                        className="mt-6 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        onClick={close}
                        className="mt-6 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditUserDialog;
