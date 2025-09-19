import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CreateSponsorForm from './CreateSponsorForm';
import Image from 'next/image';
import SponsorActions from './SponsorActions';

export default async function KelolaSponsorPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: sponsors, error } = await supabase
    .from('sponsor')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Kelola Sponsor</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daftar Sponsor */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Daftar Sponsor</h2>
          <div className="space-y-4">
            {sponsors?.map((sponsor) => (
              <div
                key={sponsor.id_sponsor}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                {/* Kiri: Logo + Info */}
                <div className="flex items-start gap-4">
                  <Image
                    src={sponsor.logo_sponsor}
                    alt={sponsor.deskripsi || 'Sponsor'}
                    width={150}
                    height={75}
                    className="object-cover rounded-md"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-800">
                      Posisi: {sponsor.posisi || 'Tidak ada posisi'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Deskripsi: {sponsor.deskripsi || 'Tidak ada deskripsi'}
                    </p>
                    <a
                      href={sponsor.url_sponsor || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-500 hover:underline"
                    >
                      {sponsor.url_sponsor || 'Tidak ada URL'}
                    </a>
                  </div>
                </div>

                 <SponsorActions sponsor={sponsor} />
              </div>
            ))}

            {/* Jika tidak ada data */}
            {sponsors?.length === 0 && (
              <p className="text-gray-500">Belum ada sponsor ditambahkan.</p>
            )}
          </div>
        </div>

        {/* Form Tambah Sponsor */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-bold mb-4">Tambah Sponsor Baru</h2>
            <CreateSponsorForm />
          </div>
        </div>
      </div>
    </div>
  );
}
