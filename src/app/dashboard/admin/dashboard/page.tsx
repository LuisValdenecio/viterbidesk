import UpdatedSession from '@/components/UpdateSession';
import AgentGraph from '@/graphs/AgentsGraph';
import TicketBackLogGraph from '@/graphs/TicketBackLogGraph';

export default function Page() {
  return (
    <div className="flex gap-5">
      <UpdatedSession />
    </div>
  );
}

/**
 *<TicketBackLogGraph />
 *<TicketBackLogGraph />
 *<TicketBackLogGraph />
 *
 *
 */
