import SectionHeading from '@/components/SectionHeading';

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Account', href: '/dashboard/agents/:id' },
  { name: 'Notifications', href: '/dashboard/account/notifications' },
  { name: 'Billing', href: '/dashboard/account/billing' },
  { name: 'Teams', href: '/dashboard/account/teams' },
  { name: 'Integrations', href: '/dashboard/account/integrations' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
        <SectionHeading tabs={tabs} mainTitle={{ title: 'Profile data' }} />
        <div className="">{children}</div>
      </div>
    </>
  );
}
