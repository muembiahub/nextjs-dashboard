import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';
import Table from '@/app/ui/customers/table';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page() {
  const customers = await fetchFilteredCustomers('');
  return (
    <div className="w-full">
      <Table customers={customers} />
    </div>
  );
}