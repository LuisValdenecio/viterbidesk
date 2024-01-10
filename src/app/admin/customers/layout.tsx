import SectionHeading from '@/components/SectionHeading';

const tabs: Array<{ name: string; href: string }> = [
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Tickering', href: '/admin/customers/tickering' },
  { name: 'Settings', href: '/admin/customers/settings' },
];

const buttonLabelAndLink: {
  buttonLabel: string;
  link: { label: string; url: string };
} = {
  buttonLabel: 'customers.cvs',
  link: {
    label: 'Add Customer',
    url: '/admin/customers/new',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
        <SectionHeading
          tabs={tabs}
          btnAndLink={buttonLabelAndLink}
          mainTitle={{ title: 'Customers' }}
        />
        <div>{children}</div>
      </div>
    </>
  );
}
