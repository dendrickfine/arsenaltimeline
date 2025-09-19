'use client';

import { useTransition } from 'react';
import { deleteSponsor } from './actions';

export default function DeleteButton({ sponsorId, imageUrl }: { sponsorId: number; imageUrl: string; }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus sponsor ini?')) {
      startTransition(async () => {
        const result = await deleteSponsor(sponsorId, imageUrl);
        alert(result.message);
      });
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-900 ...">
      {isPending ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}