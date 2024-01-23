import { InformationCircleIcon } from '@heroicons/react/20/solid';

const FriendlyAlert = () => {
  return (
    <div className="mt-2 rounded-md bg-red-50 p-1">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-red-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-red-700">warning</p>
        </div>
      </div>
    </div>
  );
};

export default FriendlyAlert;
