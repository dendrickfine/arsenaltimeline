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
    return { message: 'Fill the name!', error: true };
  }

  const { error } = await supabaseAdmin
    .from('kategori')
    .insert({ nama_kategori });

  if (error) {
    // Error code '23505' adalah untuk duplicate value (nilai unik)
    if (error.code === '23505') {
      return { message: 'Name exists.', error: true };
    }
    return { message: `Error: ${error.message}`, error: true };
  }

  revalidatePath('/dashboard/kategori');
  return { message: 'Category added!', error: false };
}

// ACTION: Mengupdate kategori
export async function updateCategory(prevState: FormState, formData: FormData): Promise<FormState> {
  const id_kategori = formData.get('id_kategori') as string;
  const nama_kategori = formData.get('nama_kategori') as string;

  if (!nama_kategori) {
    return { message: 'Fill the name!', error: true };
  }

  const { error } = await supabaseAdmin
    .from('kategori')
    .update({ nama_kategori })
    .eq('id_kategori', id_kategori);

  if (error) {
     if (error.code === '23505') {
      return { message: 'Name exists', error: true };
    }
    return { message: `Error: ${error.message}`, error: true };
  }

  revalidatePath('/dashboard/kategori');
  return { message: 'Category added!', error: false };
}


// ACTION: Menghapus kategori
export async function deleteCategory(id_kategori: number) {
  const { error } = await supabaseAdmin
    .from('kategori')
    .delete()
    .eq('id_kategori', id_kategori);

  if (error) {
    return { message: `Error: ${error.message}`, error: true };
  }

  revalidatePath('/dashboard/kategori');
  return { message: 'Successfully deleted!', error: false };
}