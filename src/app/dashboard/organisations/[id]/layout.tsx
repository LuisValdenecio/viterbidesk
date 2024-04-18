import SectionHeading from '@/components/SectionHeading';
import { fetchOrganizationName } from '@/lib/data';
import { useRouter } from 'next/router';

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Account', href: '/dashboard/agents/:id' },
  { name: 'Notifications', href: '/dashboard/account/notifications' },
  { name: 'Billing', href: '/dashboard/account/billing' },
  { name: 'Teams', href: '/dashboard/account/teams' },
  { name: 'Integrations', href: '/dashboard/account/integrations' },
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //const router = useRouter();
  //const id : string = router.query;
  //console.log(router.query);

  const organizationName: string = (await fetchOrganizationName(
    'clv3pbkll00057jdcd8x4l99n',
  )) as string;

  return (
    <>
      <div className="mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
        <SectionHeading tabs={tabs} mainTitle={{ title: organizationName }} />
        <div className="">{children}</div>
      </div>
    </>
  );
}
