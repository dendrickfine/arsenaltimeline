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
      style={{ backgroundColor: '#EF0107' }}
      className="text-white font-bold py-2 px-4 rounded transition-colors"
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EF0107')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#DB0007')}
    >
      Sign Out
    </button>

  )
}
