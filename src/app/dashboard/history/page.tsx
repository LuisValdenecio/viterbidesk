import HistoryEntry from '@/components/HistoryEntry';
import ResourceNotFound from '@/components/NotResourceFound';
import { fetchUserLogs } from '@/lib/data';

export default async function Page() {
  return <HistoryEntry />;
}
