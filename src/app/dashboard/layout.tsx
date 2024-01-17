import glob from 'fast-glob';

import { Providers } from './providers';
import { DashboardLayout } from '../../components/Layout';

import { type Metadata } from 'next';
import { type Section } from '@/components/SectionProvider';

export const metadata: Metadata = {
  title: {
    template: '%s - ViterbiDesk',
    default: 'Protocol API Reference',
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let pages = await glob('**/*.mdx', { cwd: 'src/app/dashboard' });
  let allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>;
  let allSections = Object.fromEntries(allSectionsEntries);

  return (
    <Providers>
      <div className="w-full">
        <DashboardLayout allSections={allSections}>{children}</DashboardLayout>
      </div>
    </Providers>
  );
}
