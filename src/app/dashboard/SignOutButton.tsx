'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/') // Arahkan ke homepage setelah logout
    router.refresh() // Refresh halaman untuk membersihkan state
  }

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
    >
      Sign Out
    </button>
  )
}