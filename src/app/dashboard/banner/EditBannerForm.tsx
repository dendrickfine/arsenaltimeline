'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateBanner, type FormState } from './actions';
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Menyimpan...' : 'Update Banner'}
    </button>
  );
}

export default function EditBannerForm({ banner }: { banner: any }) {
  const initialState: FormState = { message: '', error: false };
  const [state, formAction] = useActionState(updateBanner, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      alert(state.message);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-lg border p-4 shadow-sm"
    >
      {/* Hidden ID */}
      <input type="hidden" name="id_banner" value={banner.id_banner} />

      {/* Input Gambar Banner */}
      <div className="flex flex-col">
        <label htmlFor="gambar_banner" className="font-medium text-gray-700">
          Gambar Banner (Opsional untuk update)
        </label>
        <input
          type="file"
          name="gambar_banner"
          id="gambar_banner"
          accept="image/*"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-500">
          Kosongkan jika tidak ingin mengganti gambar
        </p>
      </div>

      {/* Input URL Tujuan */}
      <div className="flex flex-col">
        <label htmlFor="url_tujuan" className="font-medium text-gray-700">
          URL Tujuan
        </label>
        <input
          type="url"
          name="url_tujuan"
          id="url_tujuan"
          defaultValue={banner.url_tujuan || ''}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* Input Posisi */}
      <div className="flex flex-col">
        <label htmlFor="posisi" className="font-medium text-gray-700">
          Posisi
        </label>
        <input
          type="text"
          name="posisi"
          id="posisi"
          defaultValue={banner.posisi || ''}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* Input Deskripsi */}
      <div className="flex flex-col">
        <label htmlFor="deskripsi" className="font-medium text-gray-700">
          Deskripsi Singkat
        </label>
        <textarea
          name="deskripsi"
          id="deskripsi"
          rows={3}
          defaultValue={banner.deskripsi || ''}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        ></textarea>
      </div>

      <SubmitButton />
    </form>
  );
}
