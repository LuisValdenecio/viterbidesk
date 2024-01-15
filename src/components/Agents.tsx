import { Agent } from '@/lib/definitions';
import { fetchAgents } from '@/lib/data';
import GetAgentsData from './GetAgentsData';

export default async function Agents() {
  const agents: Agent[] = await fetchAgents();

  return (
    <>
      <GetAgentsData agents={agents} />
    </>
  );
}
