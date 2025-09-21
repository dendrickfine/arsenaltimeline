'use client';

import { useState, useTransition } from 'react';
import EditVideoModal from './EditVideoModal';
import { deleteVideo } from './actions';

// Definisikan tipe yang benar untuk Video
type Video = {
  id_video: number;
  judul_video: string;
  url_video: string;
};

// Ganti nama komponen dan props
export default function VideoActions({ video }: { video: Video }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // Gunakan properti yang benar untuk pesan konfirmasi
    if (window.confirm(`Are you sure to delete "${video.judul_video}"?`)) {
      startTransition(async () => {
        // Panggil fungsi deleteVideo
        const result = await deleteVideo(video.id_video);
        // Tampilkan pesan hasil
        alert(result.message);
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <button 
        onClick={() => setModalOpen(true)} 
        className="text-blue-600 hover:text-blue-900"
      >
        Edit
      </button>
      <button 
        onClick={handleDelete} 
        disabled={isPending} 
        className="text-red-600 hover:text-red-900 disabled:text-gray-400"
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>

      {isModalOpen && (
        // Panggil komponen EditVideoModal dengan prop yang benar
        <EditVideoModal 
            video={video} 
            onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
}