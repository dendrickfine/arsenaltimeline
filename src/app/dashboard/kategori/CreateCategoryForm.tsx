'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCategory, type FormState } from './actions';
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

export default function CreateCategoryForm() {
  const initialState: FormState = { message: '', error: false };
  const [state, formAction] = useActionState(createCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label htmlFor="nama_kategori" className="block text-sm font-medium text-gray-700">Category Name</label>
        <input type="text" id="nama_kategori" name="nama_kategori" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
      </div>
      <SubmitButton />
      {state?.message && (
        <p className={`mt-2 text-sm ${state.error ? 'text-red-500' : 'text-green-500'}`}>{state.message}</p>
      )}
    </form>
  );
}