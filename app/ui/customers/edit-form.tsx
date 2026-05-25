'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { updateCustomer, State } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import {CustomerEdit} from "@/app/lib/definitions";



export default function Form({ customer }: { customer: CustomerEdit }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateCustomer, initialState);

  return (
    <form action={formAction} className="space-y-6" method="POST">
      <input type="hidden" name="id" value={customer.id} />

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Customer name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={customer.name}
            placeholder="Enter a name"
            className="block w-full rounded-md border border-gray-200 bg-white py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="name-error"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={customer.email}
            placeholder="Enter an email"
            className="block w-full rounded-md border border-gray-200 bg-white py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="email-error"
          />
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            defaultValue={customer.image_url?? ""}
            placeholder="Optional image URL"
            className="block w-full rounded-md border border-gray-200 bg-white py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="imageUrl-error"
          />
          <div id="imageUrl-error" aria-live="polite" aria-atomic="true">
            {state.errors?.imageUrl?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>
      </div>

      {state.message && (
        <div className="rounded-md bg-red-100 p-3 text-sm text-red-700" aria-live="polite" aria-atomic="true">
          {state.message}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Customer</Button>
      </div>
    </form>
  );
}
