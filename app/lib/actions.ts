'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/* ------------------ Types ------------------ */
export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
};

export interface DeleteCustomerResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface DeleteInvoiceResponse {
  success: boolean;
  message: string;
  error?: string;
}

/* ------------------ Schemas ------------------ */
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

const CustomerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Please enter a customer name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  imageUrl: z.string().optional(),
});

/* ------------------ Customer Actions ------------------ */
export async function createCustomer(prevState: State, formData: FormData) {
  const validatedFields = CustomerSchema.omit({ id: true }).safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    imageUrl: formData.get('imageUrl'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }

  const { name, email, imageUrl } = validatedFields.data;
  const defaultImageUrl = imageUrl?.trim() || '/customers/evil-rabbit.png';

  try {
    await sql`INSERT INTO customers (name, email, image_url) VALUES (${name}, ${email}, ${defaultImageUrl})`;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function updateCustomer(prevState: State, formData: FormData) {
  const validatedFields = CustomerSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
    imageUrl: formData.get('imageUrl'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
    };
  }

  const { id, name, email, imageUrl } = validatedFields.data;
  if (!id) return { message: 'Missing customer ID. Failed to Update Customer.' };

  const defaultImageUrl = imageUrl?.trim() || '/customers/evil-rabbit.png';

  try {
    await sql`UPDATE customers SET name = ${name}, email = ${email}, image_url = ${defaultImageUrl} WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string): Promise<DeleteCustomerResponse> {
  try {
    await sql`DELETE FROM invoices WHERE customer_id = ${id}`;
    const result = await sql`DELETE FROM customers WHERE id = ${id}`;

    if (result.count === 0) {
      return { success: false, message: `No customer found with id: ${id}` };
    }

    return { success: true, message: `Customer ${id} deleted successfully` };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete customer',
      error: (error as Error).message,
    };
  }
}

/* ------------------ Invoice Actions ------------------ */
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`UPDATE invoices SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string): Promise<DeleteInvoiceResponse> {
  try {
    const result = await sql`DELETE FROM invoices WHERE id = ${id}`;

    if (result.count === 0) {
      return { success: false, message: `No invoice found with id: ${id}` };
    }

    return { success: true, message: `Invoice ${id} deleted successfully` };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete invoice',
      error: (error as Error).message,
    };
  }
}

/* ------------------ Auth ------------------ */
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
