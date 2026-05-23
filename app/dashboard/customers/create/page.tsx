import Form from '@/app/ui/customers/create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers - Create',
};

export default function Page() {
  return (
    <main className="space-y-6">
      <div className="rounded-md bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Create Customer</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add a new customer to the dashboard by providing name, email, and an optional image URL.
        </p>
      </div>
      <Form />
    </main>
  );
}