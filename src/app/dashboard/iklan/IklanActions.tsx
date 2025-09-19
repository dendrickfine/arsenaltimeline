'use client';

import { useState } from 'react';
import DeleteButton from './DeleteButton';
import EditIklanModal from './EditIklanModal';

export default function IklanActions({ iklan }: { iklan: any }) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => setModalOpen(true)} className="text-blue-600 hover:text-blue-900 font-medium">
        Edit
      </button>
      <DeleteButton iklanId={iklan.id_iklan} imageUrl={iklan.gambar_iklan} />

      {isModalOpen && (
        <EditIklanModal iklan={iklan} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}