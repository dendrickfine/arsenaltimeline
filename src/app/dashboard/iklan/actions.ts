'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type FormState = {
  message: string;
  error: boolean;
};

export async function createIklan(prevState: FormState, formData: FormData): Promise<FormState> {
  const gambarFile = formData.get('gambar_iklan') as File;
  const url_tujuan = formData.get('url_tujuan') as string;
  const posisi = formData.get('posisi') as string;
  const deskripsi = formData.get('deskripsi') as string;

  if (!gambarFile || gambarFile.size === 0) {
    return { message: 'Gambar iklan wajib diisi.', error: true };
  }

  // 1. Upload Gambar
  const fileName = `${Date.now()}-${gambarFile.name}`;
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('gambar-iklan')
    .upload(fileName, gambarFile);

  if (uploadError) {
    return { message: `Gagal mengupload gambar: ${uploadError.message}`, error: true };
  }
    
  // 2. Ambil URL Publik
  const { data: publicUrlData } = supabaseAdmin.storage
    .from('gambar-iklan')
    .getPublicUrl(uploadData.path);
  const gambar_iklan_url = publicUrlData.publicUrl;

  // 3. Insert Data ke Database
  const { error: insertError } = await supabaseAdmin.from('iklan').insert({
    gambar_iklan: gambar_iklan_url,
    url_tujuan,
    posisi,
    deskripsi,
  });

  if (insertError) {
    return { message: `Gagal membuat iklan: ${insertError.message}`, error: true };
  }
  
  revalidatePath('/dashboard/iklan');
  return { message: 'Iklan berhasil dibuat.', error: false };
}

export async function deleteIklan(id_iklan: number, gambar_iklan_url: string) {
    // 1. Hapus gambar dari storage
    const filePath = new URL(gambar_iklan_url).pathname.split('/gambar-iklan/')[1];
    await supabaseAdmin.storage.from('gambar-iklan').remove([filePath]);
  
    // 2. Hapus data dari tabel
    const { error } = await supabaseAdmin
        .from('iklan')
        .delete()
        .eq('id_iklan', id_iklan);
    
    if (error) {
        return { message: `Gagal menghapus iklan: ${error.message}`, error: true };
    }

    revalidatePath('/dashboard/iklan');
    return { message: 'Iklan berhasil dihapus.', error: false };
}

export async function updateIklan(prevState: FormState, formData: FormData): Promise<FormState> {
  const id_iklan = formData.get('id_iklan') as string;
  const old_image_url = formData.get('old_image_url') as string; // Ambil URL gambar lama
  const gambarFile = formData.get('gambar_iklan') as File;
  const url_tujuan = formData.get('url_tujuan') as string;
  const posisi = formData.get('posisi') as string;
  const deskripsi = formData.get('deskripsi') as string;

  let gambar_iklan_url: string | undefined;

  // 1. Handle jika ada gambar baru yang di-upload
  if (gambarFile && gambarFile.size > 0) {
    const fileName = `${Date.now()}-${gambarFile.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('gambar-iklan')
      .upload(fileName, gambarFile);

    if (uploadError) {
      return { message: `Gagal mengupload gambar baru: ${uploadError.message}`, error: true };
    }
    
    // Ambil URL baru
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('gambar-iklan')
      .getPublicUrl(uploadData.path);
    gambar_iklan_url = publicUrlData.publicUrl;

    // HAPUS GAMBAR LAMA JIKA ADA
    if (old_image_url) {
        const oldFilePath = new URL(old_image_url).pathname.split('/gambar-iklan/')[1];
        await supabaseAdmin.storage.from('gambar-iklan').remove([oldFilePath]);
    }
  }

  // 2. Siapkan data untuk di-update
  const dataToUpdate = {
      url_tujuan,
      posisi,
      deskripsi,
      ...(gambar_iklan_url && { gambar_iklan: gambar_iklan_url }), // Hanya update gambar jika ada URL baru
  };

  // 3. Update data di database
  const { error: updateError } = await supabaseAdmin
    .from('iklan')
    .update(dataToUpdate)
    .eq('id_iklan', Number(id_iklan));

  if (updateError) {
    return { message: `Gagal mengupdate iklan: ${updateError.message}`, error: true };
  }

  revalidatePath('/dashboard/iklan');
  return { message: 'Iklan berhasil diperbarui.', error: false };
}