'use client';

import { Agent } from '@/lib/definitions';
import { fetchAgents } from '@/lib/data';
import GetAgentsData from './GetAgentsData';
import { organizationStore } from '@/store/organization';
import { useEffect, useState, Suspense } from 'react';
import { UserSkeleton } from '@/components/Skeletons';
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

export default function Agents() {
  const emptyArray: Array<any> = [];
  let agents: Array<any> = [];
  const activeOrganizationId = organizationStore(
    (state: any) => state.activeOrganizationId,
  );

  //alert(organization);
  //const org = organizationStore.subscribe((state : any) => alert(state.activeOrganizationId));
  //org();

  const [data, setData] = useState([emptyArray]);

  useEffect(() => {
    const fetchData = async () => {
      agents = await fetchAgents(activeOrganizationId);
      setData(agents);
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });
  }, [activeOrganizationId]);

  const agentsFiltered = data.filter((agent) => agent.role_name === 'agent');

  return (
    <>
      {data.filter((agent) => agent.role_name === 'agent').length > 0 ? (
        <Suspense fallback={<UserSkeleton />}>
          <GetAgentsData agents={agentsFiltered} />
        </Suspense>
      ) : (
        <ResourceNotFound linkAndLabel={linkAndLabels} />
      )}
    </>
  );
}
