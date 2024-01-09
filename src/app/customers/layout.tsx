import { HeroPattern } from '@/components/HeroPattern';
import {SectionHeading} from '@/components/SectionHeading';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='mt-16 mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl'>
        <HeroPattern />
        <SectionHeading />
        <div>{children}</div>
      </div>
    </>
      
  );
}