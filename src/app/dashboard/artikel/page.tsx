import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DeleteArticleButton from './DeleteArticleButton';

export default async function KelolaArtikelPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // Query final menggunakan OUTER JOIN (!inner)
  const { data: articles, error } = await supabase
    .from('artikel')
    .select(`
      id_artikel,
      judul_artikel,
      status,
      created_at,
      gambar_artikel,
      kategori!inner ( nama_kategori ),
      penulis:users!inner ( nama_user )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return <p className="text-red-500 p-8">Gagal memuat artikel: {error.message}</p>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kelola Artikel</h1>
        <Link href="/dashboard/artikel/tambah" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          + Tambah Artikel Baru
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penulis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles?.map((article) => (
                <tr key={article.id_artikel}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{article.judul_artikel}</td>
                  {/* Kembalikan kode asli untuk menampilkan data */}
                  <td className="px-6 py-4 text-sm text-gray-500">{article.penulis?.nama_user || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{article.kategori?.nama_kategori || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/dashboard/artikel/edit/${article.id_artikel}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>

                      {/* Bagian ini yang perlu ditambahkan kembali */}
                      <DeleteArticleButton
                        articleId={article.id_artikel}
                        imageUrl={article.gambar_artikel}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}