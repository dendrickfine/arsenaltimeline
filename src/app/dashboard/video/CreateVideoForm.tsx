'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createVideo, type FormState } from './actions';
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

// Perbaiki nama komponen
export default function CreateVideoForm() {
  const initialState: FormState = { message: '', error: false };
  // Panggil action yang benar: createVideo
  const [state, formAction] = useActionState(createVideo, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      alert(state.message);
      if (!state.error) {
        formRef.current?.reset();
      }
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label htmlFor="judul_video" className="block text-sm font-medium text-gray-700">Title</label>
        {/* Perbaiki nama input menjadi judul_video */}
        <input type="text" id="judul_video" name="judul_video" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>

      <div>
        <label htmlFor="url_video" className="block text-sm font-medium text-gray-700">URL</label>
        {/* Tambahkan input untuk URL */}
        <input type="url" id="url_video" name="url_video" required placeholder="https://youtube.com/watch?v=..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
      
      <SubmitButton />
      {state?.message && state.error && (
        <p className="mt-2 text-sm text-red-500">{state.message}</p>
      )}
    </form>
  );
}