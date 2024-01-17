import SectionHeading from '@/components/SectionHeading';

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Tags', href: '/admin/tags' },
  { name: 'Settings', href: '/admin/tags/settings' },
];

const buttonLabelAndLink: {
  buttonLabel: string;
  link: { label: string; url: string };
} = {
  buttonLabel: 'tags.cvs',
  link: {
    label: 'Add Tag',
    url: '/admin/tags/new',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
        <SectionHeading
          tabs={tabs}
          btnAndLink={buttonLabelAndLink}
          mainTitle={{ title: 'Tags' }}
        />
        <div>{children}</div>
      </div>
    </>
  );
}
