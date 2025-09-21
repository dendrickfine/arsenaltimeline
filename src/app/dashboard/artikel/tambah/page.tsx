import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ArticleForm from '../ArticleForm';
import { createArticle } from '../actions'; // Import action create

export default async function TambahArtikelPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Article</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ArticleForm action={createArticle} />
      </div>
    </div>
  );
}
