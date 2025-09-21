'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type FormState = { message: string; error: boolean; };

// ACTION: Membuat Video Baru
export async function createVideo(prevState: FormState, formData: FormData): Promise<FormState> {
  const judul_video = formData.get('judul_video') as string;
  const url_video = formData.get('url_video') as string;

  if (!judul_video || !url_video) {
    return { message: 'Fill title adn URL!', error: true };
  }

  const { error } = await supabaseAdmin.from('video').insert({ 
    judul_video, 
    url_video
  });

  if (error) return { message: `Error: ${error.message}`, error: true };

  revalidatePath('/dashboard/video');
  return { message: 'Video added.', error: false };
}

// ACTION: Menghapus Video
export async function deleteVideo(id_video: number) {
    const { error } = await supabaseAdmin
        .from('video')
        .delete()
        .eq('id_video', id_video);
    
    if (error) return { message: `Error: ${error.message}`, error: true };

    revalidatePath('/dashboard/video');
    return { message: 'Video deleted.', error: false };
}

// ACTION: Update Video
export async function updateVideo(prevState: FormState, formData: FormData): Promise<FormState> {
    const id_video = formData.get('id_video') as string;
    const judul_video = formData.get('judul_video') as string;
    const url_video = formData.get('url_video') as string;

    if (!judul_video || !url_video) {
        return { message: 'Fill title and URL!', error: true };
    }

    const { error } = await supabaseAdmin
        .from('video')
        .update({ judul_video, url_video })
        .eq('id_video', id_video);

    if (error) return { message: `Error: ${error.message}`, error: true };

    revalidatePath('/dashboard/video');
    return { message: 'Video updated.', error: false };
}