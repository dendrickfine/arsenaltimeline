'use client';

import { useTransition } from 'react';
import { deleteArticle } from './actions';

export default function DeleteArticleButton({ articleId, imageUrl }: { articleId: number, imageUrl: string | null }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini? Aksi ini tidak bisa dibatalkan.')) {
      startTransition(async () => {
        const result = await deleteArticle(articleId, imageUrl);
        alert(result.message);
      });
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-900 disabled:text-gray-400">
      {isPending ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}