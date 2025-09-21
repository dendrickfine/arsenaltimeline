'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateVideo, type FormState } from './actions';
import { useEffect } from 'react';

// Ganti nama type dan propertinya
type Video = {
  id_video: number;
  judul_video: string;
  url_video: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

// Ganti nama komponen dan props
export default function EditVideoModal({ video, onClose }: { video: Video; onClose: () => void; }) {
  const initialState: FormState = { message: '', error: false };
  // Panggil action yang benar: updateVideo
  const [state, formAction] = useActionState(updateVideo, initialState);

  useEffect(() => {
    if (state.message) {
      alert(state.message);
      if (!state.error) {
        onClose();
      }
    }
  }, [state, onClose]);

  return (
    <dialog open onCancel={onClose} className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md backdrop:bg-black backdrop:bg-opacity-50">
      <h2 className="text-2xl font-bold mb-4">Edit Video</h2>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id_video" value={video.id_video} />
        
        <div>
          <label htmlFor="judul_video_edit" className="block text-sm font-medium text-gray-700">Title</label>
          {/* Ganti nama input dan defaultValue */}
          <input type="text" id="judul_video_edit" name="judul_video" required defaultValue={video.judul_video} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        
        <div>
          <label htmlFor="url_video_edit" className="block text-sm font-medium text-gray-700">URL</label>
          {/* Tambahkan input untuk URL */}
          <input type="url" id="url_video_edit" name="url_video" required defaultValue={video.url_video} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>

        <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
            <SubmitButton />
        </div>
        {state?.message && state.error && (
          <p className="mt-2 text-sm text-center text-red-500">{state.message}</p>
        )}
      </form>
    </dialog>
  );
}