'use client';

import { useTransition } from 'react';
import { deleteBanner } from './actions';

export default function DeleteButton({ bannerId, imageUrl }: { bannerId: number; imageUrl: string; }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Are you sure to delete?')) {
      startTransition(async () => {
        const result = await deleteBanner(bannerId, imageUrl);
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