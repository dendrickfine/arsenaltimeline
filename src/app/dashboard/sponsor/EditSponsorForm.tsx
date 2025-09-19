'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSponsor, type FormState } from './actions';
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Menyimpan...' : 'Update Sponsor'}
    </button>
  );
}

export default function EditSponsorForm({ sponsor }: { sponsor: any }) {
  const initialState: FormState = { message: '', error: false };
  const [state, formAction] = useActionState(updateSponsor, initialState);
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
      <input type="hidden" name="id_sponsor" value={sponsor.id_sponsor} />

      {/* Input Logo Sponsor */}
      <div className="flex flex-col">
        <label htmlFor="logo_sponsor" className="font-medium text-gray-700">
          Logo Sponsor (Opsional untuk update)
        </label>
        <input
          type="file"
          name="logo_sponsor"
          id="logo_sponsor"
          accept="image/*"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-500">
          Kosongkan jika tidak ingin mengganti logo
        </p>
      </div>

      {/* Input URL Sponsor */}
      <div className="flex flex-col">
        <label htmlFor="url_sponsor" className="font-medium text-gray-700">
          URL Sponsor
        </label>
        <input
          type="url"
          name="url_sponsor"
          id="url_sponsor"
          defaultValue={sponsor.url_sponsor || ''}
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
          defaultValue={sponsor.posisi || ''}
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
          defaultValue={sponsor.deskripsi || ''}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        ></textarea>
      </div>

      <SubmitButton />
    </form>
  );
}
