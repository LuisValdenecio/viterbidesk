import AgentGraph from '@/graphs/AgentsGraph';
import TicketBackLogGraph from '@/graphs/TicketBackLogGraph';

export default async function Page() {
  return (
    <>
      <div className="flex gap-4">
        <div>
          <TicketBackLogGraph></TicketBackLogGraph>
        </div>
      </div>
    </>
  );
}
