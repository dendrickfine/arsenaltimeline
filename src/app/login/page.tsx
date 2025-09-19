'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js' // <-- 1. Import SupabaseClient

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <Auth
          // @ts-ignore // Opsi lain jika type casting tidak berhasil
          supabaseClient={supabase as SupabaseClient} // <-- 2. Atasi error TypeScript
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['google']}
          view="sign_in" // <-- 3. Hanya tampilkan view sign in
          showLinks={false} // <-- 4. Sembunyikan link (termasuk ke sign up)
          redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`}
        />
      </div>
    </div>
  )
}