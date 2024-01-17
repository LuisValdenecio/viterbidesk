import SectionHeading from '@/components/SectionHeading';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <div>{children}</div>
      </div>
    </>
  );
}
