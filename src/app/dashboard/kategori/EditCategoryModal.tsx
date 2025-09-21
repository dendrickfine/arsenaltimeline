'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
// TAMBAHKAN BARIS DI BAWAH INI
import { updateCategory, type FormState } from './actions';
import { useEffect } from 'react';

type Category = {
  id_kategori: number;
  nama_kategori: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

export default function EditCategoryModal({ category, onClose }: { category: Category; onClose: () => void; }) {
  const initialState: FormState = { message: '', error: false };
  // Baris ini sekarang akan berfungsi karena 'updateCategory' sudah di-import
  const [state, formAction] = useActionState(updateCategory, initialState);

  useEffect(() => {
    if (state.message && !state.error) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <dialog open onCancel={onClose} className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md backdrop:bg-black backdrop:bg-opacity-50">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id_kategori" value={category.id_kategori} />
        <div>
          <label htmlFor="nama_kategori_edit" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input type="text" id="nama_kategori_edit" name="nama_kategori" required defaultValue={category.nama_kategori} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
            <SubmitButton />
        </div>
        {state?.message && state.error && (
          <p className={`mt-2 text-sm text-center text-red-500`}>{state.message}</p>
        )}
      </form>
    </dialog>
  );
}