'use client';

import { forwardRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

import { Logo } from '@/components/Logo';
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from '@/components/MobileNavigation';
import { useMobileNavigationStore } from '@/components/MobileNavigation';
import { MobileSearch, Search } from '@/components/Search';
import { ThemeToggle } from '@/components/ThemeToggle';
import SignedInUser from './SignedInUser';
import NotificationButton from './NotificationButton';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function TopLevelNavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

export const Header = forwardRef<
  React.ElementRef<'div'>,
  { className?: string }
>(function Header({ className }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore();
  let isInsideMobileNavigation = useIsInsideMobileNavigation();

  let { scrollY } = useScroll();
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9]);
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);
  const session = useSession();

  return (
    <>
      <motion.div
        ref={ref}
        className={clsx(
          className,
          'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
          !isInsideMobileNavigation &&
            'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80',
          isInsideMobileNavigation
            ? 'bg-white dark:bg-zinc-900'
            : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]',
        )}
        style={
          {
            '--bg-opacity-light': bgOpacityLight,
            '--bg-opacity-dark': bgOpacityDark,
          } as React.CSSProperties
        }
      >
        <div
          className={clsx(
            'absolute inset-x-0 top-full h-px transition',
            (isInsideMobileNavigation || !mobileNavIsOpen) &&
              'bg-zinc-900/7.5 dark:bg-white/7.5',
          )}
        />
        <Search />
        <div className="flex items-center gap-5 lg:hidden">
          <MobileNavigation />
          <Link href="/" aria-label="Home">
            <Logo className="h-6" />
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <nav className="hidden md:block">
            <ul role="list" className="flex items-center gap-8">
              <SignedInUser />

              <TopLevelNavItem href="#">
                {/* Profile dropdown */}

                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {session?.data?.user?.name}
                        </p>
                        <p className="text-sm">{session?.data?.user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={`/dashboard/agents/${session?.data?.user?.id}`}
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm',
                              )}
                            >
                              Account settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="#"
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm',
                              )}
                            >
                              Support
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="#"
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm',
                              )}
                            >
                              License
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={clsx(
                              'block px-4 py-2 w-full text-left text-sm text-gray-700',
                              {
                                'bg-gray-100': active,
                              },
                            )}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </TopLevelNavItem>
            </ul>
          </nav>
          <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
          <div className="flex gap-4 items-center">
            <MobileSearch />

            <NotificationButton />
            <ThemeToggle />
          </div>
          <div className="hidden min-[416px]:contents"></div>
        </div>
      </motion.div>
    </>
  );
});
