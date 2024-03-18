'use client';

import SectionHeading from '@/components/SectionHeading';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

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
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 pb-16 md:grid-cols-3 ">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
          Profile photo
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

        <div className="mt-8 flex">
          <button
            type="submit"
            disabled={!file || uploading}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {uploading ? 'saving...' : 'save'}
          </button>
        </div>
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

        <form className="flex items-start md:col-span-2">
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

const ChangePassWord = () => {
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

        <form className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="current-password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Current password
              </label>
              <div className="mt-2">
                <input
                  id="current-password"
                  name="current_password"
                  type="password"
                  autoComplete="current-password"
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
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
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

        {session.data?.user?.id === userId && (
          <>
            <ChangePassWord />
            <LogoutAllDevices />
            <DeleteAccount />
          </>
        )}
      </div>
    </main>
  );
}
