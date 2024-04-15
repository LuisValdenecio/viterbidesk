'use client';

import { HeroPattern } from '@/components/HeroPattern';
import { ButtonSignIn } from '@/components/button_signin';
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
//@ts-ignore
import { useFormStatus } from 'react-dom';
import { registerNewUser, registerSignIn } from '../lib/actions';
import EmailSentDialog from '@/components/EmailSentDialog';
import SuccessAlertDialog from '@/components/SuccessAlertDialog';
import { Button, Checkbox, Label, Popover, TextInput } from 'flowbite-react';

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Form() {
  const [isThereAFormError, SetFormError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordDontMatchError, setPasswordDontMatchError] = useState(false);

  const [containsUpperAndLowercase, setUpperAndLowerCase] = useState(false);
  const [containsNumber, setContainNumber] = useState(false);
  const [containSpecialSymbol, setSpecialSymbol] = useState(false);
  const [longEnoughPassword, setLongEnoughPassword] = useState(false);

  const [weakPassword, setWeakPassword] = useState(false);

  const watchPasswordTyping = (e: any) => {
    if (/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(e.currentTarget.value)) {
      setUpperAndLowerCase(true);
    } else {
      setUpperAndLowerCase(false);
    }

    if (/\d/.test(e.currentTarget.value)) {
      setContainNumber(true);
    } else {
      setContainNumber(false);
    }

    if (/[#$&*%^]/.test(e.currentTarget.value)) {
      setSpecialSymbol(true);
    } else {
      setSpecialSymbol(false);
    }

    if (e.currentTarget.value.length >= 8) {
      setLongEnoughPassword(true);
    } else {
      setLongEnoughPassword(false);
    }
  };

  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const password = formData.get('password');
    const email = formData.get('email');
    const confirm_password = formData.get('confirm_password');

    if (
      !containsUpperAndLowercase ||
      !containsNumber ||
      !containSpecialSymbol ||
      !longEnoughPassword
    ) {
      setWeakPassword(true);
    } else {
      setWeakPassword(false);
    }

    if (!weakPassword) {
      if (password !== confirm_password) {
        setPasswordDontMatchError(true);
      } else {
        setPasswordDontMatchError(false);

        const response = await registerNewUser(formData);

        await signIn('credentials', {
          email: email,
          password: password,
          redirect: false,
        });

        router.push(`/dashboard?initial-process=true`);
        router.refresh();
      }
    }
  };

  return (
    <>
      <SuccessAlertDialog
        linkTo={'/login'}
        linkDescription={'Sign in'}
        mainDescription={
          'A link was sent to your email to proceed to next steps'
        }
        openValue={success}
      />

      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                className="h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign up for an account
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                I already have an account{' '}
                <a
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  sign in
                </a>
              </p>
            </div>

            <div className="mt-10">
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="off"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="off"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone-number"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <label htmlFor="country" className="sr-only">
                          Country
                        </label>
                        <select
                          id="phone-number"
                          autoComplete="country"
                          className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        >
                          <option>US</option>
                          <option>CA</option>
                          <option>EU</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        name="phone-number"
                        id="phone-number"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="password1" value="Password" />
                    </div>
                    <Popover
                      trigger="hover"
                      content={
                        <div className="space-y-2 p-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Type in a secure password
                          </h3>

                          <p>make sure it contains:</p>
                          <ul>
                            <li className="mb-1 flex items-center">
                              {!containsUpperAndLowercase && (
                                <svg
                                  className="me-2.5 h-3 w-3 text-gray-300 dark:text-gray-400"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                              )}
                              {containsUpperAndLowercase && (
                                <svg
                                  className="me-2 h-3.5 w-3.5 text-green-400 dark:text-green-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 16 12"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 5.917 5.724 10.5 15 1.5"
                                  />
                                </svg>
                              )}
                              Upper & lower case letters
                            </li>
                            <li className="mb-1 flex items-center">
                              {!containsNumber && (
                                <svg
                                  className="me-2.5 h-3 w-3 text-gray-300 dark:text-gray-400"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                              )}
                              {containsNumber && (
                                <svg
                                  className="me-2 h-3.5 w-3.5 text-green-400 dark:text-green-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 16 12"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 5.917 5.724 10.5 15 1.5"
                                  />
                                </svg>
                              )}
                              A number
                            </li>
                            <li className="mb-1 flex items-center">
                              {!containSpecialSymbol && (
                                <svg
                                  className="me-2.5 h-3 w-3 text-gray-300 dark:text-gray-400"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                              )}
                              {containSpecialSymbol && (
                                <svg
                                  className="me-2 h-3.5 w-3.5 text-green-400 dark:text-green-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 16 12"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 5.917 5.724 10.5 15 1.5"
                                  />
                                </svg>
                              )}
                              A symbol (#$&*%^)
                            </li>

                            <li className="mb-1 flex items-center">
                              {!longEnoughPassword && (
                                <svg
                                  className="me-2.5 h-3 w-3 text-gray-300 dark:text-gray-400"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                              )}
                              {longEnoughPassword && (
                                <svg
                                  className="me-2 h-3.5 w-3.5 text-green-400 dark:text-green-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 16 12"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 5.917 5.724 10.5 15 1.5"
                                  />
                                </svg>
                              )}
                              Password has at least 8 characters
                            </li>
                          </ul>
                        </div>
                      }
                    >
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                          id="password1"
                          name="password"
                          type="password"
                          onChange={watchPasswordTyping}
                          autoComplete="off"
                          required
                          className={classNames(
                            weakPassword
                              ? 'block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6'
                              : 'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                          )}
                        />
                        {weakPassword && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ExclamationCircleIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                    </Popover>
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="password2" value="Confirm password" />
                    </div>
                    <Popover
                      trigger="hover"
                      content={
                        <div>
                          {passwordDontMatchError && (
                            <div className="space-y-2 p-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                The passwords don't match
                              </h3>
                            </div>
                          )}
                        </div>
                      }
                    >
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                          name="confirm_password"
                          type="password"
                          id="password2"
                          className={classNames(
                            passwordDontMatchError
                              ? 'block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6'
                              : 'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                          )}
                        />
                        {passwordDontMatchError && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ExclamationCircleIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                    </Popover>
                  </div>

                  <div>
                    <LoginButton />
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
    </>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <ButtonSignIn className="mt-4 w-full" aria-disabled={pending}>
      Create account <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </ButtonSignIn>
  );
}
