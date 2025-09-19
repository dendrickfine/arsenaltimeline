'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateIklan, type FormState } from './actions';
import { useEffect } from 'react';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
      {pending ? 'Menyimpan...' : 'Update Iklan'}
    </button>
  );
}

export default function EditIklanModal({ iklan, onClose }: { iklan: any; onClose: () => void; }) {
  const initialState: FormState = { message: '', error: false };
  const [state, formAction] = useActionState(updateIklan, initialState);

  useEffect(() => {
    if (state.message) {
      alert(state.message);
      if (!state.error) {
        onClose(); // Tutup modal jika berhasil
      }
    }
  }, [state, onClose]);

  return (
    <dialog open onCancel={onClose} className="p-6 bg-white rounded-lg shadow-xl w-full max-w-lg backdrop:bg-black backdrop:bg-opacity-50">
        <h2 className="text-xl font-bold mb-4">Edit Iklan</h2>
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="id_iklan" value={iklan.id_iklan} />
            <input type="hidden" name="old_image_url" value={iklan.gambar_iklan || ''} />
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Gambar Iklan</label>
                {iklan.gambar_iklan && <Image src={iklan.gambar_iklan} alt="Current Iklan" width={150} height={75} className="mt-2 rounded-md object-cover"/>}
                <input type="file" name="gambar_iklan" accept="image/*" className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                <p className="text-xs text-gray-500">Kosongkan jika tidak ingin mengganti gambar.</p>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">URL Tujuan</label>
                <input type="url" name="url_tujuan" defaultValue={iklan.url_tujuan || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Posisi</label>
                <input type="text" name="posisi" defaultValue={iklan.posisi || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                <textarea name="deskripsi" rows={3} defaultValue={iklan.deskripsi || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
            </div>

            <div className="flex gap-4 pt-2">
                <button type="button" onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Batal</button>
                <SubmitButton />
            </div>
            {state?.message && state.error && <p className="text-red-500 text-sm mt-2 text-center">{state.message}</p>}
        </form>
    </dialog>
  );
}