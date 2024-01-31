import { Agent } from '@/lib/definitions';
import { fetchAgents } from '@/lib/data';
import GetAgentsData from './GetAgentsData';

export default async function Agents() {
  const agents: Agent[] = await fetchAgents();
  const agentsFiltered = agents.filter((agent) => agent.role_name == 'agent');
  console.log(agents);
  return (
    <>
      <GetAgentsData agents={agentsFiltered} />
    </>
  );
}
