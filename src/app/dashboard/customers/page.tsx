import { Customers } from '@/components/Customers';
import { HeroPattern } from '@/components/HeroPattern';
import Pagination from '@/components/Pagination';

export default function Page() {
  return (
    <>
      <Customers />
      <div className="mt-10">
        <Pagination />
      </div>
    </>
  );
}
