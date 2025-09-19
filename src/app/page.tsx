import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();
  const { data: articles, error } = await supabase
    .from("artikel")
    .select(`
      id_artikel,
      judul_artikel,
      isi_artikel,
      gambar_artikel,
      created_at
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-center text-red-500">Gagal memuat artikel: {error.message}</p>;
  }

  if (!articles || articles.length === 0) {
    return <p className="text-center text-gray-500">Belum ada artikel.</p>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Berita Sepakbola Terkini
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article.id_artikel} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            {article.gambar_artikel && (
              <img
                src={article.gambar_artikel}
                alt={article.judul_artikel}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 line-clamp-2">
                {article.judul_artikel}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {/* PERBAIKAN DI SINI: Hapus tag HTML, lalu potong stringnya */}
                {article.isi_artikel.replace(/(<([^>]+)>)/gi, "").substring(0, 150)}...
              </p>
              <div className="text-sm text-gray-500">
                {new Date(article.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}