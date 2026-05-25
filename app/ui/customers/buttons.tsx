"use client";

import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useActionState } from "react";
import { deleteCustomer, State } from '@/app/lib/actions';


export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
    >
      <PencilSquareIcon className="h-4 w-4" />
      <span className="ml-2 hidden sm:inline">Edit</span>
    </Link>
  );
}

export function DeleteCustomer({ id }: { id: string }) {
  const initialState: State = { message: null, errors: {} };
  const [, formAction] = useActionState(deleteCustomer, initialState);

  return (
    <form action={formAction} className="inline-flex" method="POST">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex h-9 items-center rounded-lg bg-red-600 px-3 text-sm font-medium text-white transition-colors hover:bg-red-500"
      >
        <TrashIcon className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Delete</span>
      </button>
    </form>
  );
}