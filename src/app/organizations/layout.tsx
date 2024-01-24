'use client';

import { HeroPattern } from '@/components/HeroPattern';
import Stepper from '@/components/Stepper';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState(10);
  const pathname = usePathname();

  useEffect(() => {
    switch (pathname) {
      case '/organizations/new':
        setProgress(10);
        break;
      case '/organizations/agents':
        setProgress(65);
        break;
      case '/organizations/customers':
        setProgress(95);
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <>
      <ProgressBar
        completed={progress}
        className="absolute w-full"
        height="5px"
        borderRadius="0%"
        isLabelVisible={false}
        animateOnRender={true}
        bgColor="linear-gradient(to right, #ffe000, #799f0c);"
      />

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
};

export default Layout;
