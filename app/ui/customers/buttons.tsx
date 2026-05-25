"use client";

import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCustomer } from "@/app/lib/actions";

/* ------------------ Create Customer ------------------ */
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

/* ------------------ Update Customer ------------------ */
export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className="inline-flex h-9 items-center rounded-lg bg-yellow-600 px-3 text-sm font-medium text-white transition-colors hover:bg-yellow-500"
    >
      <PencilSquareIcon className="h-4 w-4" />
      <span className="ml-2 hidden sm:inline">Edit</span>
    </Link>
  );
}

/* ------------------ Delete Customer ------------------ */
type DeleteCustomerResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export function DeleteCustomer({ id }: { id: string }) {
  const router = useRouter();

  const deleteCustomerWithId = async () => {
    const response: DeleteCustomerResponse = await deleteCustomer(id);

    if (response.success) {
      // ✅ Refresh UI so deleted customer disappears
      router.refresh();
    } else {
      // Show error feedback
      alert(`${response.message}\n${response.error ?? ""}`);
    }
  };

  return (
    <form action={deleteCustomerWithId}>
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
