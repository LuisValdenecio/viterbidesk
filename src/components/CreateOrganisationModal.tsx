'use client';

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useContext,
  FormEvent,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  CheckIcon,
  PhotoIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { fetchIndustries, fetchRevenues } from '@/lib/data';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { FileInput, Label } from 'flowbite-react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { PopoverGuideContext } from '@/app/dashboard/popoverGuideProvider';

//@ts-ignore
import { useFormState } from 'react-dom';

import Papa from 'papaparse';

import { ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  CalendarIcon,
  CommandLineIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

import { Button } from 'flowbite-react';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { createAgent, fetchOTP } from '@/app/lib/actions';
import OTPInput from './OTPInput';

interface stepType {
  id: string;
  name: string;
  status: string;
}

const initial_steps: Array<stepType> = [];

function Steps({
  currentStepsObject,
}: {
  currentStepsObject: Array<stepType>;
}) {
  const [steps, setSteps] = useState(initial_steps);

  useEffect(() => {
    setSteps(currentStepsObject);
  }, [currentStepsObject]);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            {step.status === 'complete' ? (
              <div className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                  {step.id}
                </span>
                <p className="mt-1 text-sm text-gray-500">{step.name}</p>
              </div>
            ) : step.status === 'current' ? (
              <div
                className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-indigo-600">
                  {step.id}
                </span>
                <p className="mt-1 text-sm text-gray-500">{step.name}</p>
              </div>
            ) : (
              <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {step.id}
                </span>
                <p className="mt-1 text-sm text-gray-500">{step.name}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function Finish({
  parentCllBakc,
  closeParentWindow,
}: {
  parentCllBakc: Function;
  closeParentWindow: Function;
}) {
  let files_: Array<any> = [];
  const [files, setFiles] = useState(files_);
  const inputRef = useRef(null);

  const items = [
    {
      name: 'Marketing Campaign',
      description: 'I think the kids call these memes these days.',
      href: '#',
      iconColor: 'bg-pink-500',
      icon: MegaphoneIcon,
    },
    {
      name: 'Engineering Project',
      description:
        'Something really expensive that will ultimately get cancelled.',
      href: '#',
      iconColor: 'bg-purple-500',
      icon: CommandLineIcon,
    },
    {
      name: 'Event',
      description:
        'Like a conference all about you that no one will care about.',
      href: '#',
      iconColor: 'bg-yellow-500',
      icon: CalendarIcon,
    },
  ];

  const handleFileUpload = () => {
    inputRef?.current?.click();
  };

  const handleFileChange = (event: any) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        result.data.map((data: any) => {
          setFiles([1]);
        });
      },
    });
  };

  return (
    <div className="w-full items-center justify-center ring-1 ring-gray-900/5 sm:rounded-xl">
      <div className="text-center py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="mx-auto h-12 w-12 text-gray-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
          />
        </svg>
        <p className="mt-1 text-sm text-gray-500">
          Add up to 3 files. You might add more later
        </p>
      </div>

      {files.length === 0 && (
        <div className="flex items-center justify-end gap-x-6  px-4 py-4 sm:px-8">
          <Label
            htmlFor="dropzone-file"
            onClick={handleFileUpload}
            className="flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300  hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>

            <input
              type="file"
              className="hidden"
              ref={inputRef}
              onChange={(e: any) => {
                handleFileChange(e);
                e.target.value = null;
              }}
              accept=".csv"
            />
          </Label>
        </div>
      )}

      {files.length > 0 && (
        <ul
          role="list"
          className="mt-4 divide-y divide-gray-200  border-gray-200 px-8 pb-2"
        >
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>
              <div className="group relative flex items-start space-x-3 py-3">
                <div className="flex-shrink-0">
                  <span
                    className={classNames(
                      item.iconColor,
                      'inline-flex h-10 w-10 items-center justify-center rounded-lg',
                    )}
                  >
                    <item.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    <a href={item.href}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {item.name}
                    </a>
                  </div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <button className="inline-block rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          skip
        </button>
        <button
          type="button"
          onClick={closeParentWindow}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Finish
        </button>
      </div>
    </div>
  );
}

function InviteUsers({ parentCllBakc }: { parentCllBakc: Function }) {
  let invitees_inital: Array<{ email: string; role: string }> = [];
  const [invitees, setInvitees] = useState(invitees_inital);
  const [formError, SetFormError] = useState(false);
  const initialState = { message: null, errors: {} };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;

    if (!email || !role) {
      SetFormError(true);
    } else {
      SetFormError(false);
      if (
        invitees.filter(
          (invitee) => invitee.email === (formData.get('email') as string),
        ).length === 0
      ) {
        const response = await createAgent(initialState, formData);
        console.log(response);

        if (response?.message === 'All fields are valid') {
          const invitee: { email: string; role: string } = {
            email: email,
            role: role,
          };

          invitees_inital.push(invitee);
          setInvitees([...invitees, ...invitees_inital]);
        }
      }
    }
  };

  return (
    <div className="mx-auto ring-1 ring-gray-900/5 sm:rounded-xl ">
      <div className="px-8 py-4">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="mt-1 text-sm text-gray-500">
            Invite up to three team members. You might add more later
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 sm:flex sm:items-center">
          <label htmlFor="emails" className="sr-only">
            Email addresses
          </label>
          <div className="grid grid-cols-1 sm:flex-auto">
            <input
              type="email"
              name="email"
              required
              autocomplete="off"
              id="emails"
              className="peer relative col-start-1 row-start-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Enter an email"
            />
            <div
              className="col-start-1 col-end-3 row-start-1 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-600"
              aria-hidden="true"
            />
            <div className="col-start-2 row-start-1 flex items-center">
              <span
                className="h-4 w-px flex-none bg-gray-200"
                aria-hidden="true"
              />
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                className="rounded-md border-0 bg-transparent py-1.5 pl-4 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option disabled selected>
                  select a role
                </option>
                <option value="owner">owner</option>
                <option value="admin">admin</option>
                <option value="agent">agent</option>
                <option value="customer">customer</option>
              </select>
            </div>
          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send invite
            </button>
          </div>
        </form>
      </div>
      <div className="px-8 h-40 ">
        {invitees.length > 0 && (
          <ul role="list" className="divide-y divide-gray-100 w-full">
            {invitees.map((invitee, index) => (
              <li key={index} className="py-2">
                <div className="flex justify-between gap-x-3">
                  <div className="flex items-center gap-x-3">
                    <span className="inline-block h-6 w-6 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      {invitee.email}
                    </p>
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {invitee.role}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="green"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {invitees.length === 0 && (
          <div className="flex items-center py-4 ">
            <div className="px-6 h-full text-center w-full text-sm sm:px-14">
              <ExclamationCircleIcon
                type="outline"
                name="exclamation-circle"
                className="mx-auto h-6 w-6 text-gray-400"
              />
              <p className="mt-4 font-semibold text-gray-900">
                No invitations sent
              </p>
              <p className="mt-2 mb-4 text-gray-500">
                You haven't added a team member
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between  border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <div className="flex items-center">
          {formError && (
            <p className="mt-1 text-sm text-red-500">
              Please insert a valid e-mail and role for the invitee
            </p>
          )}
        </div>

        <div className="flex items-center gap-x-6">
          <button
            type="button"
            onClick={parentCllBakc}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}

function OrgForm({ parentCllBakc }: { parentCllBakc: Function }) {
  const session = useSession();

  const emptyArray: Array<any> = [];
  const [industries, setIndustries] = useState(emptyArray);
  const [revenues, setRevenue] = useState(emptyArray);

  useEffect(() => {
    const fetchData = async () => {
      let revenue_option = await fetchRevenues();
      let industry_option = await fetchIndustries();
      setRevenue(revenue_option);
      setIndustries(industry_option);
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });
  }, [industries, revenues]);

  const handleSubtmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData);

    try {
      const response = await fetch('/api/organisation', {
        method: 'POST',
        body: formData,
      });

      if (response) {
        parentCllBakc();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubtmit}
      className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
    >
      <div className="px-4 py-6 sm:p-8">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="street-address"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Organisation name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="organisation"
                required
                id="organisation"
                placeholder="please type in the organisation name"
                autoComplete="street-address"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="hidden">
            <div className="flex h-6 items-center">
              <input name="user_id" value={session.data?.user?.id} />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="industry"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Industry
            </label>
            <div className="mt-2">
              <select
                id="country"
                name="industry"
                required
                autoComplete="country-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {industries.map((industry) => (
                  <option>{industry.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="industry"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Anual revenue
            </label>
            <div className="mt-2">
              <select
                id="revenue"
                name="revenue"
                required
                autoComplete="country-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {revenues.map((revenue) => (
                  <option>{revenue?.revenue}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Country
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="country"
                required
                id="city"
                autoComplete="address-level2"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="region"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              State / Province
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="state"
                required
                id="state"
                autoComplete="address-level1"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="postal-code"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              City
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="city"
                required
                id="city"
                autoComplete="postal-code"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next step
        </button>
      </div>
    </form>
  );
}

export default function CreateOrganisationModal({
  open,
  close,
  parentCallBack,
}: {
  open: boolean;
  close: Function;
  parentCallBack: Function;
}) {
  let initial_steps: Array<stepType> = [
    { id: 'Step 1', name: 'Create organisation', status: 'current' },
    { id: 'Step 2', name: 'Invite users', status: 'upcoming' },
  ];

  const popOverGuideStarted = useContext(PopoverGuideContext);
  const router = useRouter();

  const [steps, setSteps] = useState(initial_steps);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [activeStep, setActiveStep] = useState(1);
  //const [openSelectOrgModal, setSelectOrgModal] = useState(false);

  const onCloseDialogWindow = () => {
    close();
  };

  const move_to_second_step = () => {
    initial_steps[0].status = 'complete';
    initial_steps[1].status = 'current';
    setSteps(initial_steps);
  };

  //const [open, setOpen] = useState(true)

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={onCloseDialogWindow}
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
                <Steps currentStepsObject={steps} />

                {steps[0].status === 'current' && (
                  <div className="w-210 divide-y divide-gray-900/10 mt-6">
                    <div className="invite-modal">
                      <OrgForm parentCllBakc={move_to_second_step} />
                    </div>
                  </div>
                )}

                {steps[1].status === 'current' && (
                  <div className="w-210 divide-y divide-gray-900/10 mt-6">
                    <div className="invite-modal">
                      <InviteUsers parentCllBakc={onCloseDialogWindow} />
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
