'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Tipe state untuk feedback form
export type FormState = {
  message: string;
  error: boolean;
};

// ACTION: Membuat kategori baru
export async function createCategory(prevState: FormState, formData: FormData): Promise<FormState> {
  const nama_kategori = formData.get('nama_kategori') as string;

  if (!nama_kategori) {
    return { message: 'Nama kategori tidak boleh kosong.', error: true };
  }

  const { error } = await supabaseAdmin
    .from('kategori')
    .insert({ nama_kategori });

  if (error) {
    // Error code '23505' adalah untuk duplicate value (nilai unik)
    if (error.code === '23505') {
      return { message: 'Nama kategori sudah ada.', error: true };
    }
    return { message: `Gagal membuat kategori: ${error.message}`, error: true };
  }

  revalidatePath('/dashboard/kategori');
  return { message: 'Kategori berhasil dibuat.', error: false };
}

// ACTION: Mengupdate kategori
export async function updateCategory(prevState: FormState, formData: FormData): Promise<FormState> {
  const id_kategori = formData.get('id_kategori') as string;
  const nama_kategori = formData.get('nama_kategori') as string;

  if (!nama_kategori) {
    return { message: 'Nama kategori tidak boleh kosong.', error: true };
  }

  const { error } = await supabaseAdmin
    .from('kategori')
    .update({ nama_kategori })
    .eq('id_kategori', id_kategori);

  if (error) {
     if (error.code === '23505') {
      return { message: 'Nama kategori sudah ada.', error: true };
    }
    return { message: `Gagal mengupdate kategori: ${error.message}`, error: true };
  }

  revalidatePath('/dashboard/kategori');
  return { message: 'Kategori berhasil diupdate.', error: false };
}


// ACTION: Menghapus kategori
export async function deleteCategory(id_kategori: number) {
  const { error } = await supabaseAdmin
    .from('kategori')
    .delete()
    .eq('id_kategori', id_kategori);

  if (error) {
    return { message: `Gagal menghapus kategori: ${error.message}`, error: true };
  }

  revalidatePath('/dashboard/kategori');
  return { message: 'Kategori berhasil dihapus.', error: false };
}