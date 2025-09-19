'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type FormState = {
  message: string;
  error: boolean;
};

export async function createArticle(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Akses ditolak: Anda harus login.', error: true };
  }

  const judul_artikel = formData.get('judul_artikel') as string;
  const isi_artikel = formData.get('isi_artikel') as string;
  const id_kategori = formData.get('id_kategori') as string;
  const status = formData.get('status') as 'published' | 'draft';
  const gambarFile = formData.get('gambar_artikel') as File;

  // -- VALIDASI BARU --
  if (!id_kategori) {
    return { message: 'Kategori wajib dipilih.', error: true };
  }
  if (!judul_artikel) {
    return { message: 'Judul artikel tidak boleh kosong.', error: true };
  }
  // --------------------

  let gambar_artikel_url = null;

  // ... (kode upload gambar tidak berubah) ...
  if (gambarFile && gambarFile.size > 0) {
    const fileName = `${user.id}/${Date.now()}-${gambarFile.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from('gambar-artikel').upload(fileName, gambarFile);
    if (uploadError) {
      return { message: `Gagal mengupload gambar: ${uploadError.message}`, error: true };
    }
    const { data: publicUrlData } = supabaseAdmin.storage.from('gambar-artikel').getPublicUrl(uploadData.path);
    gambar_artikel_url = publicUrlData.publicUrl;
  }

  const { error: insertError } = await supabaseAdmin.from('artikel').insert({
    judul_artikel,
    isi_artikel,
    id_kategori: parseInt(id_kategori),
    status,
    penulis: user.id,
    gambar_artikel: gambar_artikel_url,
  });

  if (insertError) {
    return { message: `Gagal membuat artikel: ${insertError.message}`, error: true };
  }

  revalidatePath('/dashboard/artikel');
  // Kita akan pindahkan redirect ke sisi klien setelah pesan sukses
  return { message: 'Artikel berhasil dibuat!', error: false };
}


// ACTION: Menghapus Artikel
export async function deleteArticle(id_artikel: number, gambar_artikel_url: string | null) {
  // 1. Hapus gambar dari storage jika ada
  if (gambar_artikel_url) {
    const filePath = new URL(gambar_artikel_url).pathname.split('/gambar-artikel/')[1];
    await supabaseAdmin.storage.from('gambar-artikel').remove([filePath]);
  }

  // 2. Hapus data artikel dari tabel
  const { error } = await supabaseAdmin
    .from('artikel')
    .delete()
    .eq('id_artikel', id_artikel);

  if (error) {
    return { message: `Gagal menghapus artikel: ${error.message}`, error: true };
  }

  revalidatePath('/dashboard/artikel');
  return { message: 'Artikel berhasil dihapus.', error: false };
}

// ACTION: Mengupdate Artikel yang Ada
export async function updateArticle(prevState: FormState, formData: FormData): Promise<FormState> {
  const id_artikel = formData.get('id_artikel') as string;
  const old_image_url = formData.get('old_image_url') as string;

  const judul_artikel = formData.get('judul_artikel') as string;
  const isi_artikel = formData.get('isi_artikel') as string;
  const id_kategori = formData.get('id_kategori') as string;
  const status = formData.get('status') as 'published' | 'draft';
  const gambarFile = formData.get('gambar_artikel') as File;
  
  // Validasi
  if (!id_kategori) {
    return { message: 'Kategori wajib dipilih.', error: true };
  }
  if (!judul_artikel) {
    return { message: 'Judul artikel tidak boleh kosong.', error: true };
  }
  
  let gambar_artikel_url = old_image_url; // Defaultnya gunakan gambar lama

  // 1. Handle perubahan gambar
  if (gambarFile && gambarFile.size > 0) {
    // a. Upload gambar baru
    const fileName = `${new Date().toISOString()}-${gambarFile.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('gambar-artikel')
      .upload(fileName, gambarFile);

    if (uploadError) {
      return { message: `Gagal upload gambar baru: ${uploadError.message}`, error: true };
    }

    // b. Ambil URL publik gambar baru
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('gambar-artikel')
      .getPublicUrl(uploadData.path);
    gambar_artikel_url = publicUrlData.publicUrl;

    // c. Hapus gambar lama dari storage jika ada
    if (old_image_url) {
      const oldFilePath = new URL(old_image_url).pathname.split('/gambar-artikel/')[1];
      await supabaseAdmin.storage.from('gambar-artikel').remove([oldFilePath]);
    }
  }

  // 2. Update data di database
  const { error: updateError } = await supabaseAdmin
    .from('artikel')
    .update({
      judul_artikel,
      isi_artikel,
      id_kategori: parseInt(id_kategori),
      status,
      gambar_artikel: gambar_artikel_url,
      updated_at: new Date().toISOString(), // Set waktu update
    })
    .eq('id_artikel', parseInt(id_artikel));

  if (updateError) {
    return { message: `Gagal mengupdate artikel: ${updateError.message}`, error: true };
  }

  revalidatePath('/dashboard/artikel');
  // Di akhir, ganti redirect('/dashboard/artikel') dengan:
  return { message: 'Artikel berhasil diupdate!', error: false };
}