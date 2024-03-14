import SectionHeading from '@/components/SectionHeading';

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Agents', href: '/dashboard/agents' },
  { name: 'Tickering', href: '/dashboard/agents/tickering' },
  { name: 'Settings', href: '/dashboard/agents/settings' },
];

const buttonLabelAndLink: {
  buttonLabel: string;
  link: { label: string; url: string };
} = {
  buttonLabel: 'agents.cvs',
  link: {
    label: 'Add Agent',
    url: '/dashboard/admin/agents/new',
  },
};

export default function Page() {
  return (
    <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <SectionHeading tabs={tabs} btnAndLink={buttonLabelAndLink} />
      <h1>Settings</h1>
    </div>
  );
}
