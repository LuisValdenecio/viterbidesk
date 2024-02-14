'use client';

import { fetchUserInvitationToken } from "@/lib/data";
import { useEffect, useState } from "react";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { setUpInvitation } from "@/app/lib/actions";
//@ts-ignore
import { useFormState } from 'react-dom';

export default function Page( { params }: { params: { token: string } }) {

  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  const initialState = { message: null, errors: {} };
  const updateAgentWithId = setUpInvitation.bind(null, userId);
  const [state, dispatch] = useFormState(updateAgentWithId, initialState);
  

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUserInvitationToken(params.token);
      setUserEmail(user?.email as string);
      setUserId(user?.id as string);
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });
    
  }, []);


  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Set up your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              This member invitation was sent to{' '}
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                {userEmail}
              </a>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form action={dispatch} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      aria-describedby="name-error"
                    />
                  </div>

              
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Retype Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="retypepassword"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Set up
                  </button>
                </div>
              </form>
            </div>

            
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt=""
        />
      </div>
    </div>
  )
}
