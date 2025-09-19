import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CreateIklanForm from './CreateIklanForm';
import Image from 'next/image';
import IklanActions from './IklanActions';

export default async function KelolaIklanPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: iklans, error } = await supabase
    .from('iklan')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Kelola Iklan</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daftar Iklan */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Daftar Iklan</h2>
          <div className="space-y-4">
            {iklans?.map((iklan) => (
              <div
                key={iklan.id_iklan}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                {/* Kiri: Gambar + Info */}
                <div className="flex items-start gap-4">
                  <Image
                    src={iklan.gambar_iklan}
                    alt={iklan.deskripsi || 'Iklan'}
                    width={150}
                    height={75}
                    className="object-cover rounded-md"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-800">
                      Posisi: {iklan.posisi || 'Tidak ada posisi'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Deskripsi: {iklan.deskripsi || 'Tidak ada deskripsi'}
                    </p>
                    <a
                      href={iklan.url_tujuan || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-500 hover:underline"
                    >
                      {iklan.url_tujuan || 'Tidak ada URL'}
                    </a>
                  </div>
                </div>

                 <IklanActions iklan={iklan} />
              </div>
            ))}

            {/* Jika tidak ada data */}
            {iklans?.length === 0 && (
              <p className="text-gray-500">Belum ada iklan ditambahkan.</p>
            )}
          </div>
        </div>

        {/* Form Tambah Iklan */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-bold mb-4">Tambah Iklan Baru</h2>
            <CreateIklanForm />
          </div>
        </div>
      </div>
    </div>
  );
}
