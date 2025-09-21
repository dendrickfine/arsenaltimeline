import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CreateBannerForm from './CreateBannerForm';
import Image from 'next/image';
import BannerActions from './BannerActions';

export default async function KelolaBannerPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id_user', session.user.id).single();
  if (profile?.role !== 'admin') {
    return <div className="text-red-500 font-bold text-center mt-10">Access Denied. This page is for admins only.</div>;
  }

  const { data: banners, error } = await supabase
    .from('banner')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Banner</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daftar Banner */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Banner List</h2>
          <div className="space-y-4">
            {banners?.map((banner) => (
              <div
                key={banner.id_banner}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                {/* Kiri: Gambar + Info */}
                <div className="flex items-start gap-4">
                  <Image
                    src={banner.gambar_banner}
                    alt={banner.deskripsi || 'Banner'}
                    width={150}
                    height={75}
                    className="object-cover rounded-md"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-800">
                      Position: {banner.posisi || 'Tidak ada posisi'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Description: {banner.deskripsi || 'Tidak ada deskripsi'}
                    </p>
                    <a
                      href={banner.url_tujuan || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-500 hover:underline"
                    >
                      {banner.url_tujuan || 'Tidak ada URL'}
                    </a>
                  </div>
                </div>

                 <BannerActions banner={banner} />
              </div>
            ))}

            {/* Jika tidak ada data */}
            {banners?.length === 0 && (
              <p className="text-gray-500">No banners added.</p>
            )}
          </div>
        </div>

        {/* Form Tambah Banner */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-bold mb-4">Add New Banner</h2>
            <CreateBannerForm />
          </div>
        </div>
      </div>
    </div>
  );
}
