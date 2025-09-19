'use client';

import { useState } from 'react';
import DeleteButton from './DeleteButton';
import EditSponsorModal from './EditSponsorModal';

export default function SponsorActions({ sponsor }: { sponsor: any }) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => setModalOpen(true)} className="text-blue-600 hover:text-blue-900 font-medium">
        Edit
      </button>
      <DeleteButton sponsorId={sponsor.id_sponsor} imageUrl={sponsor.logo_sponsor} />

      {isModalOpen && (
        <EditSponsorModal sponsor={sponsor} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}