'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateUser, type FormState } from './actions';
import { useEffect } from 'react';

type User = {
    id_user: string;
    nama_user: string;
    email: string;
    instagram: string | null;
    role: 'admin' | 'user';
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
            {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
    );
}

export default function EditUserModal({ user, onClose }: { user: User; onClose: () => void; }) {
    const initialState: FormState = { message: '', error: false };
    const [state, formAction] = useActionState(updateUser, initialState);
    // const dialogRef = useRef<HTMLDialogElement>(null); <-- Dihapus karena tidak digunakan

    useEffect(() => {
        if (state.message && !state.error) {
            onClose();
        }
    }, [state, onClose]);

    return (
        <dialog open onCancel={onClose} className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md backdrop:bg-black backdrop:bg-opacity-50">
            <h2 className="text-2xl font-bold mb-4">Edit: {user.nama_user}</h2>
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="id_user" value={user.id_user} />

                <div>
                    <label htmlFor="nama_user" className="block text-sm font-medium text-gray-700">Name</label>
                    {/* className dilengkapi */}
                    <input type="text" id="nama_user" name="nama_user" required defaultValue={user.nama_user} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" required defaultValue={user.email} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram (Optional)</label>
                    {/* className dilengkapi */}
                    <input type="text" id="instagram" name="instagram" placeholder="@username" defaultValue={user.instagram || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                    {/* className dilengkapi */}
                    <select id="role" name="role" defaultValue={user.role} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                    <SubmitButton />
                </div>
                {state?.message && (
                    <p className={`mt-2 text-sm text-center ${state.error ? 'text-red-500' : 'text-green-500'}`}>
                        {state.message}
                    </p>
                )}
            </form>
        </dialog>
    );
}