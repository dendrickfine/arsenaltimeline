'use client';

import { useState, useTransition } from 'react';
import EditCategoryModal from './EditCategoryModal';
import { deleteCategory } from './actions';

type Category = {
  id_kategori: number;
  nama_kategori: string;
};

export default function CategoryActions({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    const confirmDelete = confirm(
      `Apakah kamu yakin ingin menghapus kategori "${category.nama_kategori}"?`
    );
    if (!confirmDelete) return;

    startTransition(async () => {
      const res = await deleteCategory(category.id_kategori);
      if (res.error) {
        alert(res.message);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setIsEditing(true)}
        className="text-indigo-600 hover:text-indigo-900 mr-2"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 hover:text-red-900 disabled:opacity-50"
      >
        {isPending ? 'Menghapus...' : 'Hapus'}
      </button>

      {isEditing && (
        <EditCategoryModal
          category={category}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
