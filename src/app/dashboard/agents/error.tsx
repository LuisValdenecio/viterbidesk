'use client';

import { Button } from '@/components/Button';
import { HeroPattern } from '@/components/HeroPattern';
import { Metadata } from 'next';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: 'Customers',
  description:
    'On this page, we will dive into the different attachment endpoints you can use to manage attachments programmatically.',
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const linkAndLabels: {
    href: string;
    label: string;
    mainTitle: string;
    mainText: string;
  } = {
    href: '/admin/agents',
    label: 'try again',
    mainTitle: 'Oops! Something went wrong',
    mainText:
      'Looks like there are no registered agents in the system at the moment.',
  };

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <HeroPattern />
      <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center py-16 text-center">
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
          {linkAndLabels.mainTitle}
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          {linkAndLabels.mainText}
        </p>
        <Button onClick={() => reset()} arrow="right" className="mt-8">
          {linkAndLabels.label}
        </Button>
      </div>
    </div>
  );
}
