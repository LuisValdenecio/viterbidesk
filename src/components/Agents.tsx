'use client';

import { Agent } from '@/lib/definitions';
import GetAgentsData from './GetAgentsData';
import { Suspense, useEffect, useState } from 'react';
import { organizationStore } from '@/store/organization';
import { fetchAgents } from '@/lib/data';
import { UserSkeleton } from './Skeletons';
import ResourceNotFound from './no-resource';

const linkAndLabels: {
  href: string;
  label: string;
  mainTitle: string;
  mainText: string;
} = {
  href: '/dashboard/admin/agents/new',
  label: 'add agent',
  mainTitle: 'Oops! No Agents Found',
  mainText:
    'Looks like there are no registered agents in the system at the moment.',
};

export default function Agents({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const emptyArray: Array<any> = [];
  let users_copy: any = null;
  const [users, setUsers] = useState(emptyArray);

  const activeOrgId = organizationStore(
    (state: any) => state.activeOrganizationId,
  );

  useEffect(() => {
    const fetchData = async () => {
      users_copy = await fetchAgents(activeOrgId, query, currentPage);
      console.log(query);
      console.log(currentPage);
      setUsers(users_copy);
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });
  }, [activeOrgId, query, currentPage]);

  return (
    <>
      <Suspense fallback={<UserSkeleton />}>
        <GetAgentsData agents={users} />
      </Suspense>
    </>
  );
}
