import SectionHeading from '@/components/SectionHeading';

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Delete', href: '/dashboard/history' },
  { name: 'Update', href: '/dashboard/history/update' },
  { name: 'Invite', href: '/dashboard/history/invite' },
  { name: 'Sign in logs', href: '/dashboard/history/session' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionHeading tabs={tabs} mainTitle={{ title: 'History' }} />
      <div>{children}</div>
    </>
  );
}
