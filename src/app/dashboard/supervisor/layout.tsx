import { HeroPattern } from '@/components/HeroPattern';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
        <HeroPattern />
        <div>{children}</div>
      </div>
    </>
  );
}
