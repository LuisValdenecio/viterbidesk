'use client';

import {
  CheckCircleIcon,
  LockClosedIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function Stepper() {
  const pathname = usePathname();
  const steps = [
    { name: 'Create account', href: '#', status: 'complete' },
    {
      name: 'create organization',
      href: '/organizations/new',
      status: 'upcoming',
    },
    { name: 'Add Agents', href: '/organizations/agents', status: 'upcoming' },
    {
      name: 'Add customers',
      href: '/organizations/customers',
      status: 'upcoming',
    },
    { name: 'Finishing up', href: '/preparing', status: 'upcoming' },
  ];

  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="fixed px-4 sm:px-6 lg:px-8">
      <nav className="flex justify-center" aria-label="Progress">
        <ol role="list" className="space-y-6">
          {steps.map((step, index) => (
            <li key={step.name} onClick={() => setActiveStep(index)}>
              {step.status === 'complete' ? (
                <Link href={step.href} className="group">
                  <span className="flex items-start">
                    <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <CheckCircleIcon
                        className="h-full w-full text-indigo-600 group-hover:text-indigo-800"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                      {step.name}
                    </span>
                  </span>
                </Link>
              ) : step.href === pathname ? (
                <Link
                  href={step.href}
                  className="flex items-start"
                  aria-current="step"
                >
                  <span
                    className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="absolute h-4 w-4 rounded-full bg-indigo-200" />
                    <span className="relative block h-2 w-2 rounded-full bg-indigo-600" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-indigo-600">
                    {step.name}
                  </span>
                </Link>
              ) : step.href !== pathname &&
                index < activeStep &&
                step.status != 'complete' ? (
                <Link href={step.href} className="group">
                  <span className="flex items-start">
                    <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <XCircleIcon
                        className="h-full w-full text-red-600 group-hover:text-red-800"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                      {step.name}
                    </span>
                  </span>
                </Link>
              ) : (
                <Link href={step.href} className="group">
                  <div className="flex items-start">
                    <div
                      className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
                    </div>
                    <p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                      {step.name}
                    </p>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
