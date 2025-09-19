import ArticleForm from '../ArticleForm';
import { createArticle } from '../actions'; // Import action create

export default function TambahArtikelPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Tambah Artikel Baru</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ArticleForm action={createArticle} />
      </div>
    </div>
  );
}