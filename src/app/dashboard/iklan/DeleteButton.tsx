'use client';

import { useTransition } from 'react';
import { deleteIklan } from './actions';

export default function DeleteButton({ iklanId, imageUrl }: { iklanId: number; imageUrl: string; }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus Iklan ini?')) {
      startTransition(async () => {
        const result = await deleteIklan(iklanId, imageUrl);
        alert(result.message);
      });
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-900 ...">
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}