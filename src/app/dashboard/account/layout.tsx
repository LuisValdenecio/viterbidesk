import SectionHeading from '@/components/SectionHeading';

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Account', href: '/dashboard/admin/account' },
  { name: 'Notifications', href: '/dashboard/admin/account/notifications' },
  { name: 'Billing', href: '/dashboard/admin/account/billing' },
  { name: 'Teams', href: '/dashboard/admin/account/teams' },
  { name: 'Integrations', href: '/dashboard/admin/account/integrations' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <SectionHeading tabs={tabs} />
        <div className="py-16">{children}</div>
      </div>
    </>
  );
}
