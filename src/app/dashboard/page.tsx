import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'

// Komponen Tombol Logout (akan kita buat di bawah)
import SignOutButton from './SignOutButton'

export default async function DashboardPage() {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    // Jika tidak ada sesi (user belum login), tendang ke halaman login
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto p-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Selamat Datang di Dashboard!</h1>
                        <p className="text-gray-600 mt-2">
                            Anda login sebagai: <span className="font-semibold">{session.user.email}</span>
                        </p>
                    </div>
                    <SignOutButton />
                </div>
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Menu Navigasi</h2>
                <nav className="flex flex-col space-y-2">
                    <Link href="/dashboard/users" className="text-blue-500 hover:underline">
                        Kelola Users
                    </Link>
                    <Link href="/dashboard/kategori" className="text-blue-500 hover:underline">
                        Kelola Kategori
                    </Link>
                    <Link href="/dashboard/artikel" className="text-blue-500 hover:underline">Kelola Artikel</Link>
                    <Link href="/dashboard/banner" className="text-blue-500 hover:underline">
                        Kelola Banner
                    </Link>
                    <Link href="/dashboard/iklan" className="text-blue-500 hover:underline">
                        Kelola Iklan
                    </Link>
                </nav>
            </div>
        </div>
    )
}