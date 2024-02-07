'use client';

import { HeroPattern } from '@/components/HeroPattern';
import Stepper from '@/components/Stepper';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
//import ProgressBar from '@ramonak/react-progress-bar';
import Router from 'next/router';
import ProgressBar from '@/components/ProgressBar';
import { SessionProvider } from 'next-auth/react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

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
      <SessionProvider>
        <ProgressBar percentage={progress} />
        <div className="mx-auto mt-16 w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
          <div className="two-column-layout">
            <div className="relative">
              <Stepper />
            </div>
            <div>{children}</div>
          </div>
        </div>
      </SessionProvider>
    </>
  );
};

export default Layout;
