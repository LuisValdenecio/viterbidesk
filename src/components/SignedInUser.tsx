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
import { useSearchParams } from 'next/navigation';
import ConfirmationBanner from './Banner';

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

  const [data, setData] = useState(organizations);
  const [showChangedOrgModal, setShowChangedOrgModal] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [isEmailDialogOpen, openEmailDialog] = useState(false);

  const openDialog = () => {
    openEmailDialog(true);
  };

  useEffect(() => {
    openEmailDialog(false); // run every time the organisation param changes
    setShowChangedOrgModal(true);
  }, [params.get('organisation')]);

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
        className="inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        My organizations
        <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
          {data.length}
        </span>
      </button>

      <OrganizationModal
        open={isEmailDialogOpen}
        close={() => openEmailDialog(false)}
        orgs={data}
      />
    </div>
  );
}
