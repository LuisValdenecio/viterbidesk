import { Button } from '@/components/Button';
import { HeroPattern } from '@/components/HeroPattern';

interface LinkAndLabel {
  href: string;
  label: string;
  mainTitle: string;
  mainText: string;
}

const ResourceNotFound: React.FC<{ linkAndLabel: LinkAndLabel }> = ({
  linkAndLabel,
}) => {
  return (
    <>
      <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center py-16 text-center">
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
          {linkAndLabel.mainTitle}
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          {linkAndLabel.mainText}
        </p>
        <Button href={linkAndLabel.href} arrow="right" className="mt-8">
          {linkAndLabel.label}
        </Button>
      </div>
    </>
  );
};

export default ResourceNotFound;
