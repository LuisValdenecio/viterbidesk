import { HeroPattern } from '@/components/HeroPattern';
import Stepper from '@/components/Stepper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroPattern />
      <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
        <div className="two-column-layout">
          <div className="relative">
            <Stepper />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
