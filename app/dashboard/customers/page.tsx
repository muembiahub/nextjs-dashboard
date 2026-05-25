import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
    </div>
  );
}