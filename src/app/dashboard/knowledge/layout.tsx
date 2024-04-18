'use client';
import { useState, Fragment, useRef, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { OrganizationContext } from '../activeOrganizationProvider';
import { useFormStatus } from 'react-dom';

//@ts-ignore
import { useFormState } from 'react-dom';
import { createTopic } from '@/app/lib/actions';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  );
}

function Header() {
  const [openModal, setOpenModal] = useState(false);

  const open = () => {
    setOpenModal(true);
  };

  return (
    <>
      <TopicCreator open={openModal} close={() => setOpenModal(false)} />
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Knowledge
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">Viterbi</p>
        </div>
        <div className="mt-3 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New topic
          </button>
        </div>
      </div>
    </>
  );
}

function Submit({ parentCllback }: { parentCllback: Function }) {
  const { pending } = useFormStatus();
  parentCllback(pending);
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

function TopicCreator({ open, close }: { open: boolean; close: Function }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createTopic, initialState);
  const [pendingFormState, setPendingState] = useState(false);

  const handlePendingFormState = (childData: boolean) => {
    setPendingState(childData);
  };

  const activeOrgId = useContext(OrganizationContext)?.organizationId;
  const cancelButtonRef = useRef(null);

  if (state.message === 'All fields are valid') {
    close();
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={() => {
          close();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                <div className="border-gray-200">
                  <div className="ring-1 ring-gray-900/5 sm:rounded-xl ">
                    <form
                      action={dispatch}
                      className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
                    >
                      <div className="px-4 py-6 sm:p-8">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                          Create a topic
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600 pb-6">
                          A topic could a product, service or anything else.
                        </p>
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div className="col-span-full">
                            <label
                              htmlFor="first-name"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Topic
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
                              {state.errors?.topicName &&
                                state.errors.topicName.map((error: string) => (
                                  <>
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                    <p
                                      className="mt-2 text-sm text-red-500"
                                      key={error}
                                    >
                                      {error}
                                    </p>
                                  </>
                                ))}
                            </div>
                          </div>

                          <div className="hidden">
                            <div className="flex h-6 items-center">
                              <input name="org_id" value={activeOrgId} />
                            </div>
                          </div>

                          <div className="col-span-full">
                            <label
                              htmlFor="about"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              About
                            </label>
                            <div className="mt-2">
                              <textarea
                                id="about"
                                name="about"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                aria-describedby="about-error"
                                defaultValue={''}
                              />
                            </div>
                            <div
                              className="flex h-8 items-end space-x-1"
                              id="about-error"
                              aria-live="polite"
                              aria-atomic="true"
                            >
                              {state.errors?.topicDescription &&
                                state.errors.topicDescription.map(
                                  (error: string) => (
                                    <>
                                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                      <p
                                        className="mt-2 text-sm text-red-500"
                                        key={error}
                                      >
                                        {error}
                                      </p>
                                    </>
                                  ),
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        <button
                          type="button"
                          className="text-sm font-semibold leading-6 text-gray-900"
                          onClick={() => {
                            close();
                          }}
                        >
                          Cancel
                        </button>
                        <Submit parentCllback={handlePendingFormState} />
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
