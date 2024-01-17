import Logout from '@/app/logout/logout';
import Dashboard from './dashboard/page';
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession();

  return (
    <>
      {!!session && <Logout />}
      <Dashboard />
    </>
  );
}
