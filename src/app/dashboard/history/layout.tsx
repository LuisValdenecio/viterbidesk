import SectionHeading from '@/components/SectionHeading';

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Removals', href: '/dashboard/history' },
  { name: 'Updates', href: '/dashboard/historyarticles' },
  { name: 'Sessions Register', href: '/dashboard/history/settings' },
  { name: 'AI history', href: '/dashboard/history/settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionHeading tabs={tabs} mainTitle={{ title: 'History' }} />
      <div>{children}</div>
    </>
  );
}
