'use client';

// PERBAIKI BARIS IMPORT DI BAWAH INI
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { changeUserPassword, type FormState } from './actions';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
      {pending ? 'Menyimpan...' : 'Ganti Password'}
    </button>
  );
}

export default function ChangePasswordModal({ userId, userName, onClose }: { userId: string; userName: string; onClose: () => void; }) {
  const initialState: FormState = { message: '', error: false };
  const [state, formAction] = useActionState(changeUserPassword, initialState);

  useEffect(() => {
    if (state.message) {
        alert(state.message); // Beri notifikasi
        if(!state.error) {
            onClose(); // Tutup modal jika berhasil
        }
    }
  }, [state, onClose]);

  return (
    <dialog open onCancel={onClose} className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md backdrop:bg-black backdrop:bg-opacity-50">
      <h2 className="text-2xl font-bold mb-4">Ganti Password: {userName}</h2>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id_user" value={userId} />
        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">Password Baru</label>
          <input type="password" id="new_password" name="new_password" required minLength={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
        </div>
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
          <input type="password" id="confirm_password" name="confirm_password" required minLength={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
        </div>
        <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Batal</button>
            <SubmitButton />
        </div>
        {state?.message && state.error && (
          <p className="mt-2 text-sm text-center text-red-500">
            {state.message}
          </p>
        )}
      </form>
    </dialog>
  );
}