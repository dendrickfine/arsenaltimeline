import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateUserForm from './CreateUserForm' // Komponen form tambah user
import UserActions from './UserActions'     // Komponen untuk tombol Edit & Hapus

export default async function KelolaUsersPage() {
  const supabase = createClient()

  // Ambil sesi & cek role admin
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }
  const { data: profile } = await supabase.from('users').select('role').eq('id_user', session.user.id).single()
  if (profile?.role !== 'admin') {
    return (
      <div className="text-red-500 font-bold text-center mt-10">
        Akses Ditolak. Halaman ini hanya untuk admin.
      </div>
    )
  }
  
  // Ambil semua data user
  const { data: users, error } = await supabase.from('users').select('*').order('created_at')
  if (error) {
    return <p>Gagal memuat data user: {error.message}</p>
  }
  
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Kelola Users</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Daftar User */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Daftar User</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id_user}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nama_user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <UserActions user={user} currentUserId={session.user.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolom Kanan: Form Tambah User */}
        <div className="lg:col-span-1">
          {/* DI SINI TEMPATNYA */}
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-bold mb-4">Tambah User Baru</h2>
            <CreateUserForm />
          </div>
        </div>
      </div>
    </div>
  )
}