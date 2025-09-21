'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type FormState = { message: string; error: boolean; };

// ACTION: Membuat Sponsor Baru
export async function createSponsor(prevState: FormState, formData: FormData): Promise<FormState> {
  const logoFile = formData.get('logo_sponsor') as File;
  const url_sponsor = formData.get('url_sponsor') as string;
  const posisi = formData.get('posisi') as string;
  const deskripsi = formData.get('deskripsi') as string;
  let logo_sponsor_url = null;

  if (logoFile && logoFile.size > 0) {
    const fileName = `${Date.now()}-${logoFile.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('logo-sponsor')
      .upload(fileName, logoFile);
    if (uploadError) return { message: `Gagal upload logo: ${uploadError.message}`, error: true };
    
    const { data: publicUrlData } = supabaseAdmin.storage.from('logo-sponsor').getPublicUrl(uploadData.path);
    logo_sponsor_url = publicUrlData.publicUrl;
  }

  const { error: insertError } = await supabaseAdmin.from('sponsor').insert({
    logo_sponsor: logo_sponsor_url,
    url_sponsor,
    posisi,
    deskripsi,
  });

  if (insertError) return { message: `Error: ${insertError.message}`, error: true };
  
  revalidatePath('/dashboard/sponsor');
  return { message: 'Sponsor added.', error: false };
}

// ACTION: Menghapus Sponsor
export async function deleteSponsor(id_sponsor: number, logo_sponsor_url: string | null) {
    if (logo_sponsor_url) {
        const filePath = new URL(logo_sponsor_url).pathname.split('/logo-sponsor/')[1];
        await supabaseAdmin.storage.from('logo-sponsor').remove([filePath]);
    }
  
    const { error } = await supabaseAdmin
        .from('sponsor')
        .delete()
        .eq('id_sponsor', id_sponsor);
    
    if (error) {
        return { message: `Error: ${error.message}`, error: true };
    }

    revalidatePath('/dashboard/sponsor');
    return { message: 'Sponsor deleted.', error: false };
}

// ACTION: Update Sponsor
export async function updateSponsor(prevState: FormState, formData: FormData): Promise<FormState> {
  const id_sponsor = formData.get('id_sponsor') as string;
  const old_image_url = formData.get('old_image_url') as string;
  const logoFile = formData.get('logo_sponsor') as File;
  const url_sponsor = formData.get('url_sponsor') as string;
  const posisi = formData.get('posisi') as string;
  const deskripsi = formData.get('deskripsi') as string;

  let logo_sponsor_url: string | undefined;

  if (logoFile && logoFile.size > 0) {
    const fileName = `${Date.now()}-${logoFile.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('logo-sponsor')
      .upload(fileName, logoFile);

    if (uploadError) {
      return { message: `Error: ${uploadError.message}`, error: true };
    }
    
    const { data: publicUrlData } = supabaseAdmin.storage.from('logo-sponsor').getPublicUrl(uploadData.path);
    logo_sponsor_url = publicUrlData.publicUrl;

    if (old_image_url) {
        const oldFilePath = new URL(old_image_url).pathname.split('/logo-sponsor/')[1];
        await supabaseAdmin.storage.from('logo-sponsor').remove([oldFilePath]);
    }
  }

  const dataToUpdate = {
      url_sponsor,
      posisi,
      deskripsi,
      ...(logo_sponsor_url && { logo_sponsor: logo_sponsor_url }),
  };

  const { error: updateError } = await supabaseAdmin
    .from('sponsor')
    .update(dataToUpdate)
    .eq('id_sponsor', Number(id_sponsor));

  if (updateError) {
    return { message: `Error: ${updateError.message}`, error: true };
  }

  revalidatePath('/dashboard/sponsor');
  return { message: 'Sponsor updated.', error: false };
}