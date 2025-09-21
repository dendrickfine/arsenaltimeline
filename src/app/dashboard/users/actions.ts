'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Tipe untuk state form (untuk memberikan feedback ke user)
export type FormState = {
  message: string
  error: boolean
}

export async function createUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nama_user = formData.get('nama_user') as string
  const instagram = formData.get('instagram') as string // Ambil data instagram
  const role = formData.get('role') as 'admin' | 'user'

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { 
      nama_user: nama_user,
      instagram: instagram // Kirim instagram ke metadata agar ditangkap trigger
    } 
  })

  // ... (sisa kode tidak berubah) ...
  if (authError) {
    return { message: `Gagal membuat user: ${authError.message}`, error: true }
  }

  if (role === 'admin') {
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .update({ role: 'admin' })
      .eq('id_user', authData.user.id)

    if (profileError) {
      return { message: `User dibuat, tapi gagal menjadikan admin: ${profileError.message}`, error: true }
    }
  }
  
  revalidatePath('/dashboard/users')
  return { message: 'User berhasil dibuat.', error: false }
}

// ACTION: Menghapus user
export async function deleteUser(userId: string) {
  'use server'
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
  if (error) {
    console.error('Error deleting user:', error)
    return { message: `Gagal menghapus user: ${error.message}` }
  }

  revalidatePath('/dashboard/users')
  return { message: 'User berhasil dihapus.' }
}

// ACTION: Mengupdate user (versi diperbarui)
export async function updateUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const id_user = formData.get('id_user') as string;
  const nama_user = formData.get('nama_user') as string;
  const instagram = formData.get('instagram') as string;
  const role = formData.get('role') as 'admin' | 'user';
  const email = formData.get('email') as string; // <-- Ambil email baru

  // 1. Update data di tabel profil public.users
  const { error: profileError } = await supabaseAdmin
    .from('users')
    .update({ nama_user, instagram, role, email }) // <-- Tambahkan email
    .eq('id_user', id_user);

  if (profileError) {
    return { message: `Gagal mengupdate profil: ${profileError.message}`, error: true };
  }

  // 2. Update metadata dan email di tabel auth.users
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    id_user,
    { 
      email: email, // <-- Tambahkan email
      user_metadata: { nama_user, instagram } 
    }
  );

  if (authError) {
    console.warn(`Error: ${authError.message}`);
  }

  revalidatePath('/dashboard/users');
  return { message: 'User updated.', error: false };
}

// ACTION: Mengganti password user
export async function changeUserPassword(prevState: FormState, formData: FormData): Promise<FormState> {
  const id_user = formData.get('id_user') as string;
  const new_password = formData.get('new_password') as string;
  const confirm_password = formData.get('confirm_password') as string;

  // 1. Validasi dasar
  if (new_password.length < 6) {
    return { message: 'Password must minimum 6 karakter.', error: true };
  }
  if (new_password !== confirm_password) {
    return { message: 'Password not match.', error: true };
  }

  // 2. Update password di Supabase Auth
  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    id_user,
    { password: new_password }
  );

  if (error) {
    return { message: `Error: ${error.message}`, error: true };
  }

  // revalidatePath tidak diperlukan karena tidak ada data di halaman yang berubah
  return { message: 'Password updated.', error: false };
}

