'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Import Tiptap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { FormState } from './actions'; // Import tipe FormState

// Komponen Toolbar sederhana untuk Tiptap
const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="border border-gray-300 rounded-t-md p-2 bg-gray-50 flex gap-2">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-300 p-1 rounded' : 'p-1 rounded'}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-300 p-1 rounded' : 'p-1 rounded'}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'bg-gray-300 p-1 rounded' : 'p-1 rounded'}>Paragraph</button>
    </div>
  );
};

// Komponen Tombol Submit
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded disabled:bg-gray-400">
      {pending ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
    </button>
  );
}

type Category = { id_kategori: number; nama_kategori: string; };
type Article = {
    id_artikel: number;
    judul_artikel: string;
    isi_artikel: string;
    id_kategori: number | null;
    status: string;
    gambar_artikel: string | null;
}

export default function ArticleForm({ action, article }: { action: (prevState: FormState, formData: FormData) => Promise<FormState>, article?: Article }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const initialState: FormState = { message: '', error: false };
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('kategori').select('*');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  // Efek untuk menampilkan notifikasi dan redirect jika berhasil
  useEffect(() => {
    if (state.message && !state.error) {
        alert(state.message); // Tampilkan notifikasi sukses
        router.push('/dashboard/artikel'); // Redirect ke daftar artikel
    }
  }, [state, router]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: article?.isi_artikel || '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
        const form = document.querySelector('form');
        if (form) {
            const hiddenInput = form.querySelector('input[name="isi_artikel"]') as HTMLInputElement;
            if (hiddenInput) {
                hiddenInput.value = editor.getHTML();
            }
        }
    }
  });

  return (
    <form action={formAction} className="space-y-6">
      {article && (
        <>
          <input type="hidden" name="id_artikel" value={article.id_artikel} />
          <input type="hidden" name="old_image_url" value={article.gambar_artikel || ''} />
        </>
      )}

      <div>
        <label htmlFor="judul_artikel" className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" name="judul_artikel" id="judul_artikel" required defaultValue={article?.judul_artikel} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
      </div>

      <div>
        <label htmlFor="id_kategori" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="id_kategori"
          id="id_kategori"
          required
          defaultValue={article?.id_kategori ? String(article.id_kategori) : ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id_kategori} value={String(cat.id_kategori)}>
              {cat.nama_kategori}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="gambar_artikel" className="block text-sm font-medium text-gray-700">Main Image</label>
        {article?.gambar_artikel && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">Current Image :</p>
            <Image src={article.gambar_artikel} alt={article.judul_artikel} width={200} height={100} className="rounded-md object-cover" />
          </div>
        )}
        <input type="file" name="gambar_artikel" id="gambar_artikel" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <p className="text-xs text-gray-500 mt-1">Please ignore if you don't want to change the image.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
        <input name="isi_artikel" type="hidden" defaultValue={article?.isi_artikel || ''} />
        <div className="border border-gray-300 rounded-md">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <div className="mt-2 space-x-4">
          <label><input type="radio" name="status" value="draft" defaultChecked={article?.status === 'draft' || !article} className="mr-2" /> Draft</label>
          <label><input type="radio" name="status" value="published" defaultChecked={article?.status === 'published'} className="mr-2" /> Published</label>
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton isEditing={!!article} />
      </div>

      {state?.message && state.error && (
        <p className="mt-2 text-sm text-center text-red-500">{state.message}</p>
      )}
    </form>
  );
}