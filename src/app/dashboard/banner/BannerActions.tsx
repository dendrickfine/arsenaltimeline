'use client';

import { useState } from 'react';
import DeleteButton from './DeleteButton';
import EditBannerModal from './EditBannerModal';

export default function BannerActions({ banner }: { banner: any }) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => setModalOpen(true)} className="text-blue-600 hover:text-blue-900 font-medium">
        Edit
      </button>
      <DeleteButton bannerId={banner.id_banner} imageUrl={banner.gambar_banner} />

      {isModalOpen && (
        <EditBannerModal banner={banner} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}