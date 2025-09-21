'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createBanner, type FormState } from './actions';
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 font-bold disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

export default function CreateBannerForm() {
  const initialState: FormState = { message: '', error: false };
  const [state, formAction] = useActionState(createBanner, initialState);
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
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-lg border p-4 shadow-sm"
    >
      {/* Input Gambar Banner */}
      <div className="flex flex-col">
        <label
          htmlFor="gambar_banner"
          className="font-medium text-gray-700"
        >
          Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="gambar_banner"
          id="gambar_banner"
          required
          accept="image/*"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* Input URL Tujuan */}
      <div className="flex flex-col">
        <label
          htmlFor="url_tujuan"
          className="font-medium text-gray-700"
        >
          URL <span className="text-gray-500">(Optional)</span>
        </label>
        <input
          type="url"
          name="url_tujuan"
          id="url_tujuan"
          placeholder="https://example.com"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* Input Posisi */}
      <div className="flex flex-col">
        <label
          htmlFor="posisi"
          className="font-medium text-gray-700"
        >
          Position <span className="text-gray-500">(Optional)</span>
        </label>
        <input
          type="text"
          name="posisi"
          id="posisi"
          placeholder="Contoh: Halaman Depan Atas"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* Input Deskripsi */}
      <div className="flex flex-col">
        <label
          htmlFor="deskripsi"
          className="font-medium text-gray-700"
        >
          Description <span className="text-gray-500">(Optional)</span>
        </label>
        <textarea
          name="deskripsi"
          id="deskripsi"
          rows={3}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        ></textarea>
      </div>

      {/* Tombol Submit */}
      <SubmitButton />
    </form>
  );
}
