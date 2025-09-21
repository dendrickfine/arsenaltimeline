import ArticleForm from '../../ArticleForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { updateArticle } from '../../actions'; // Import action update

export default async function EditArtikelPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: article, error } = await supabase
    .from('artikel')
    .select('*')
    .eq('id_artikel', params.id)
    .single();

  if (error || !article) {
    redirect('/dashboard/artikel');
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Kirim action dan data artikel ke form */}
        <ArticleForm action={updateArticle} article={article} />
      </div>
    </div>
  );
}