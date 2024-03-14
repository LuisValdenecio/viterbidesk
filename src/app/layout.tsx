import { HeroPattern } from '@/components/HeroPattern';
import '../styles/tailwind.css';
import { Metadata } from 'next';
import Banner from '@/components/Banner';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full h-full bg-white antialiased dark:bg-zinc-900">
        {children}
      </body>
    </html>
  );
}
