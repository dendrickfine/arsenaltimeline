'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type FormState = {
  message: string;
  error: boolean;
};

// ACTION: Membuat Banner Baru
export async function createBanner(prevState: FormState, formData: FormData): Promise<FormState> {
  const gambarFile = formData.get('gambar_banner') as File;
  const url_tujuan = formData.get('url_tujuan') as string;
  const posisi = formData.get('posisi') as string;
  const deskripsi = formData.get('deskripsi') as string;

  if (!gambarFile || gambarFile.size === 0) {
    return { message: 'Pick image!', error: true };
  }

  // 1. Upload Gambar
  const fileName = `${Date.now()}-${gambarFile.name}`;
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('gambar-banner')
    .upload(fileName, gambarFile);

  if (uploadError) {
    return { message: `Error: ${uploadError.message}`, error: true };
  }
    
  // 2. Ambil URL Publik
  const { data: publicUrlData } = supabaseAdmin.storage
    .from('gambar-banner')
    .getPublicUrl(uploadData.path);
  const gambar_banner_url = publicUrlData.publicUrl;

  // 3. Insert Data ke Database
  const { error: insertError } = await supabaseAdmin.from('banner').insert({
    gambar_banner: gambar_banner_url,
    url_tujuan,
    posisi,
    deskripsi,
  });

  if (insertError) {
    return { message: `Error: ${insertError.message}`, error: true };
  }
  
  revalidatePath('/dashboard/banner');
  return { message: 'Banner added.', error: false };
}

// ACTION: Menghapus Banner
export async function deleteBanner(id_banner: number, gambar_banner_url: string) {
    // 1. Hapus gambar dari storage
    const filePath = new URL(gambar_banner_url).pathname.split('/gambar-banner/')[1];
    await supabaseAdmin.storage.from('gambar-banner').remove([filePath]);
  
    // 2. Hapus data dari tabel
    const { error } = await supabaseAdmin
        .from('banner')
        .delete()
        .eq('id_banner', id_banner);
    
    if (error) {
        return { message: `Error: ${error.message}`, error: true };
    }

    revalidatePath('/dashboard/banner');
    return { message: 'Successfully deleted.', error: false };
}

// ACTION: Update Banner (Versi diperbaiki)
export async function updateBanner(prevState: FormState, formData: FormData): Promise<FormState> {
  const id_banner = formData.get('id_banner') as string;
  const old_image_url = formData.get('old_image_url') as string; // Ambil URL gambar lama
  const gambarFile = formData.get('gambar_banner') as File;
  const url_tujuan = formData.get('url_tujuan') as string;
  const posisi = formData.get('posisi') as string;
  const deskripsi = formData.get('deskripsi') as string;

  let gambar_banner_url: string | undefined;

  // 1. Handle jika ada gambar baru yang di-upload
  if (gambarFile && gambarFile.size > 0) {
    const fileName = `${Date.now()}-${gambarFile.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('gambar-banner')
      .upload(fileName, gambarFile);

    if (uploadError) {
      return { message: `Error: ${uploadError.message}`, error: true };
    }
    
    // Ambil URL baru
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('gambar-banner')
      .getPublicUrl(uploadData.path);
    gambar_banner_url = publicUrlData.publicUrl;

    // HAPUS GAMBAR LAMA JIKA ADA
    if (old_image_url) {
        const oldFilePath = new URL(old_image_url).pathname.split('/gambar-banner/')[1];
        await supabaseAdmin.storage.from('gambar-banner').remove([oldFilePath]);
    }
  }

  // 2. Siapkan data untuk di-update
  const dataToUpdate = {
      url_tujuan,
      posisi,
      deskripsi,
      ...(gambar_banner_url && { gambar_banner: gambar_banner_url }), // Hanya update gambar jika ada URL baru
  };

  // 3. Update data di database
  const { error: updateError } = await supabaseAdmin
    .from('banner')
    .update(dataToUpdate)
    .eq('id_banner', Number(id_banner));

  if (updateError) {
    return { message: `Error: ${updateError.message}`, error: true };
  }

  revalidatePath('/dashboard/banner');
  return { message: 'Banner updated.', error: false };
}