'use client';

import { Fragment, useEffect, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import {
  BuildingLibraryIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';
import {
  BookmarkSquareIcon,
  CalendarDaysIcon,
  LifebuoyIcon,
} from '@heroicons/react/24/outline';
import { fetchOrganizations } from '@/lib/data';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { organizationStore } from '@/store/organization';
import { ArrowDownIcon } from '@heroicons/react/24/solid';
import OrganizationModal from './OrganizationModal';

const recentPosts = [
  {
    id: 1,
    title: 'Boost your conversion rate',
    href: '#',
    date: 'Mar 5, 2023',
    datetime: '2023-03-05',
  },
];

export default function SignedInUser() {
  let organizations: Array<any> = [];
  const setActiveOrg = organizationStore((state: any) => state.setActiveOrg);

  const [data, setData] = useState(organizations);
  const activeOrgId = organizationStore(
    (state: any) => state.activeOrganizationId,
  );

  const [isEmailDialogOpen, openEmailDialog] = useState(false);

  const openDialog = () => {
    openEmailDialog(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      organizations = await fetchOrganizations();
      setData([...data, ...organizations]);
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });
  }, []);

  return (
    <div>
      <button
        onClick={() => openDialog()}
        type="button"
        className="inline-flex items-center gap-x-1 rounded-md bg-gray-600 px-2 py-0.5 text-sm  text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Organizations
        <ArrowDownIcon className="-mr-0.4 h-4 w-4" aria-hidden="true" />
      </button>

      <OrganizationModal
        open={isEmailDialogOpen}
        close={() => openEmailDialog(false)}
        orgs={data}
      />
    </div>
  );
}
