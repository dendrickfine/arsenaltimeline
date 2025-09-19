import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CreateCategoryForm from './CreateCategoryForm';
import CategoryActions from './CategoryActions';

export default async function KelolaKategoriPage() {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id_user', session.user.id).single();
  if (profile?.role !== 'admin') {
    return <div className="text-red-500 font-bold text-center mt-10">Akses Ditolak. Halaman ini hanya untuk admin.</div>;
  }

  const { data: categories, error } = await supabase.from('kategori').select('*').order('nama_kategori');

  if (error) {
    return <p>Gagal memuat data kategori: {error.message}</p>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Kelola Kategori Artikel</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Daftar Kategori</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id_kategori}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.nama_kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <CategoryActions category={category} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-bold mb-4">Tambah Kategori Baru</h2>
            <CreateCategoryForm />
          </div>
        </div>
      </div>
    </div>
  );
}