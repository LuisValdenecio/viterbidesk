'use client';

import { useSession } from 'next-auth/react';
import { FormEvent, useContext, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
//@ts-ignore
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { changePassword, updateAgent } from '@/app/lib/actions';
import { OrganizationContext } from '../../activeOrganizationProvider';
import { fetchUserNameAndEmail } from '@/lib/data';
import { Progress } from 'rsup-progress';
import ChangePasswordDialog from '@/components/ChangePasswordDialog';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
//@ts-ignore
import { useFormStatus } from 'react-dom';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      {pending ? 'Sending...' : 'Update password'}
    </button>
  );
}

const ProfileInformation = ({
  isAccountOwner,
}: {
  isAccountOwner: boolean;
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { update } = useSession();
  const session = useSession();

  const param = useSearchParams();
  const userId = usePathname().split('/')[3];

  console.log(param);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user-id', userId);

    try {
      const response = await fetch('/api/s3-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data.status);

      // update the user session
      session.update({ img: data.fileName });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 ">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
          Avatar
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Upload a photo from your device to
        </p>
      </div>

      <form className="md:col-span-2" onSubmit={handleFileSubmit}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div className="col-span-full flex items-center gap-x-8">
            <img
              src={session?.data?.user?.img}
              alt=""
              className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            />
            {isAccountOwner && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <p className="mt-2 text-xs leading-5  text-gray-500 dark:text-gray-400">
                  JPG or PNG. 1MB max.
                </p>
              </div>
            )}
          </div>
        </div>

        {isAccountOwner && (
          <div className="mt-8 flex">
            <button
              type="submit"
              disabled={!file || uploading}
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {uploading ? 'saving...' : 'save'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const DeleteAccount = () => {
  return (
    <>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
            Delete account
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            No longer want to use our service? You can delete your account here.
            This action is not reversible. All information related to this
            account will be deleted permanently.
          </p>
        </div>

        <form className="flex items-start md:col-span-2" id="step-6">
          <button
            type="submit"
            className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
          >
            Yes, delete my account
          </button>
        </form>
      </div>
    </>
  );
};

const LogoutAllDevices = () => {
  return (
    <>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
            Log out other sessions
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Please enter your password to confirm you would like to log out of
            your other sessions across all of your devices.
          </p>
        </div>

        <form className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="logout-password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <div className="mt-2">
                <input
                  id="logout-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Log out other sessions
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const progress = new Progress({
  height: 3,
  color: 'linear-gradient(to right, #00f260, #0575e6)',
});

const ChangePassWord = () => {
  const [showPasswordsDontMatchError, setShowPasswordsDontMatchError] =
    useState(false);
  const [showInsecurePasswordError, setShowInsecurePasswordError] =
    useState(false);
  const [showIncorrectOldPassword, setShowIncorrectOldPassword] =
    useState(false);
  const [showPasswordChangeSuccess, setShowPasswordChaneSuccess] =
    useState(false);

  const handlePendingFormState = (pending: boolean) => {
    if (pending) {
      progress.start();
    } else {
      progress.end();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //const { pending } = useFormStatus();
    //console.log(pending);
    const formData = new FormData(e.currentTarget);
    const pasword = formData.get('new_password') as string;
    const reTypedPassword = formData.get('confirm_password') as string;

    if (pasword !== reTypedPassword) {
      setShowPasswordsDontMatchError(true);
      setShowInsecurePasswordError(false);
      setShowIncorrectOldPassword(false);
      setShowPasswordChaneSuccess(false);
    } else {
      if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(pasword)) {
        setShowInsecurePasswordError(true);
        setShowPasswordsDontMatchError(false);
        setShowIncorrectOldPassword(false);
        setShowPasswordChaneSuccess(false);
      } else {
        setShowInsecurePasswordError(false);
        setShowPasswordsDontMatchError(false);

        const response = await changePassword(formData);
        if (response?.message === 'the old password is incorrect') {
          setShowIncorrectOldPassword(true);
          setShowInsecurePasswordError(false);
          setShowPasswordsDontMatchError(false);
          setShowPasswordChaneSuccess(false);
        } else if (response?.message === 'password updated successfully') {
          setShowInsecurePasswordError(false);
          setShowPasswordsDontMatchError(false);
          setShowIncorrectOldPassword(false);
          setShowPasswordChaneSuccess(true);
        }
      }
    }
  };

  return (
    <>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
            Change password
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Update your password associated with your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Old password
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  name="old_password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                New password
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  name="new_password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Confirm new password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
                />
              </div>

              {showPasswordsDontMatchError && (
                <div
                  className="flex h-8 items-end space-x-1 mt-2"
                  id="name-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="mt-2 text-sm text-red-500" key="fdfdfd">
                    The passwords do not match.
                  </p>
                </div>
              )}

              {showIncorrectOldPassword && (
                <div
                  className="flex h-8 items-end space-x-1 mt-2"
                  id="name-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="mt-2 text-sm text-red-500" key="fdfdfd">
                    The old password is incorrect
                  </p>
                </div>
              )}

              {showInsecurePasswordError && (
                <div
                  className="flex h-8 items-end space-x-1 mt-2"
                  id="name-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="mt-2 text-sm text-red-500" key="fdfdfd">
                    Please choose an alphanumeric password with a minimum of 8
                    characters.
                  </p>
                </div>
              )}

              {showPasswordChangeSuccess && (
                <div
                  className="flex h-8 items-end space-x-1 mt-2"
                  id="name-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                  <p className="mt-2 text-sm text-green-500" key="fdfdfd">
                    Password changed successfully
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex">
            <Submit />
          </div>
        </form>
      </div>
    </>
  );
};

const ChangeProfileName = () => {
  const session = useSession();
  const initialState = { message: null, errors: {} };
  const updateAgentWithId = updateAgent.bind(null, session.data?.user?.id);
  const [state, dispatch] = useFormState(updateAgentWithId, initialState);
  const activeOrgId = useContext(OrganizationContext)?.organizationId;
  const [activeAgent, setActiveAgent] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const agent = await fetchUserNameAndEmail();
      setActiveAgent(agent);
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });
  }, []);

  return (
    <>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
            Profile name
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Update your password associated with your account.
          </p>
        </div>

        <form className="md:col-span-2" action={dispatch}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="current-password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                E-mail
              </label>
              <div className="mt-2">
                <input
                  id="current-password"
                  name="email"
                  type="email"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
                  defaultValue={activeAgent?.email as string}
                />
              </div>
            </div>

            <div className="hidden">
              <div className="">
                <input name="org_id" value={activeOrgId} />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  name="name"
                  type="text"
                  required
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10 sm:text-sm sm:leading-6"
                  defaultValue={activeAgent?.name as string}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default function Page() {
  const session = useSession();
  const userId = usePathname().split('/')[3];

  return (
    <main>
      {/* Settings forms */}
      <div className="divide-y divide-gray-200 dark:divide-white/5">
        <ProfileInformation
          isAccountOwner={session.data?.user?.id === userId}
        />
        <ChangeProfileName />

        {session.data?.user?.id === userId && (
          <>
            <ChangePassWord />
            <DeleteAccount />
          </>
        )}
      </div>
    </main>
  );
}
