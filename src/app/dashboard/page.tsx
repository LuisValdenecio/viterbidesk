import CompletionAnimation from '@/components/CompletionAnimation';
import CreateOrganisationGuide from '@/components/CreateOrganisationGuide';
import AgentGraph from '@/graphs/AgentsGraph';
import TicketBackLogGraph from '@/graphs/TicketBackLogGraph';

export default async function Page() {
  return (
    <>
      <div className="flex gap-4">
        <div className="relative">
          <TicketBackLogGraph></TicketBackLogGraph>
          <CreateOrganisationGuide />
        </div>
      </div>
    </>
  );
}
