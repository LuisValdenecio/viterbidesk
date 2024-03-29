'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Logo } from '@/components/Logo';
import { Navigation } from '@/components/Navigation';
import { type Section, SectionProvider } from '@/components/SectionProvider';
import { SessionProvider } from 'next-auth/react';
import Banner from './Banner';

export function DashboardLayout({
  children,
  allSections,
}: {
  children: React.ReactNode;
  allSections: Record<string, Array<Section>>;
}) {
  let pathname = usePathname();

  return (
    <SessionProvider>
      <SectionProvider sections={allSections[pathname] ?? []}>
        <div className="h-full lg:ml-72 xl:ml-80">
          <motion.header
            layoutScroll
            className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
          >
            <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
              <div className="hidden lg:flex">
                <Link href="/" aria-label="Home">
                  <Logo className="h-6" />
                </Link>
              </div>
              <Header />
              <Navigation className="hidden lg:mt-10 lg:block" />
            </div>
          </motion.header>
          <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
            <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
              <main className="flex-auto">{children}</main>
            </div>
          </div>
        </div>
      </SectionProvider>
    </SessionProvider>
  );
}
