'use client';

import { useState } from 'react';
import DeleteButton from './DeleteButton';
import EditUserModal from './EditUserModal';
import ChangePasswordModal from './ChangePasswordModal'; // <-- Import modal baru

// ... (Tipe User tidak berubah) ...
type User = {
  id_user: string;
  nama_user: string;
  email: string;
  instagram: string | null;
  role: 'admin' | 'user';
}

export default function UserActions({ user, currentUserId }: { user: User; currentUserId: string; }) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false); // <-- State baru

  return (
    <div className="flex items-center justify-end gap-4 text-sm">
      <button 
        onClick={() => setPasswordModalOpen(true)} // <-- Tombol baru
        className="text-orange-600 hover:text-orange-900"
      >
        Change Password
      </button>

      <button 
        onClick={() => setEditModalOpen(true)} 
        className="text-blue-600 hover:text-blue-900"
      >
        Edit Profile
      </button>

      {user.id_user !== currentUserId && <DeleteButton userId={user.id_user} />}

      {isEditModalOpen && (
        <EditUserModal user={user} onClose={() => setEditModalOpen(false)} />
      )}
      
      {isPasswordModalOpen && ( // <-- Render modal baru
        <ChangePasswordModal 
            userId={user.id_user} 
            userName={user.nama_user} 
            onClose={() => setPasswordModalOpen(false)} 
        />
      )}
    </div>
  );
}