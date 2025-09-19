'use client'

// 1. IMPORT useState
import { useActionState, useState } from 'react' 
import { useFormStatus } from 'react-dom'
import { createUser, type FormState } from './actions'

// Komponen tombol submit tidak berubah
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
    >
      {pending ? 'Menyimpan...' : 'Simpan User'}
    </button>
  )
}


export default function CreateUserForm() {
  const initialState: FormState = { message: '', error: false }
  const [state, formAction] = useActionState(createUser, initialState)
  
  // 2. TAMBAHKAN STATE UNTUK KONDISI CHECKBOX
  const [showPassword, setShowPassword] = useState(false)

   return (
    <form action={formAction} className="space-y-4">
      {/* Input Nama, Email, Instagram tidak berubah */}
      <div>
        <label htmlFor="nama_user" className="block text-sm font-medium text-gray-700">Nama User</label>
        <input type="text" id="nama_user" name="nama_user" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
      </div>
      <div>
        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram (Opsional)</label>
        <input type="text" id="instagram" name="instagram" placeholder="@username" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
      </div>
      
      {/* Area Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input 
          // 3. UBAH TIPE INPUT BERDASARKAN STATE
          type={showPassword ? 'text' : 'password'} 
          id="password" 
          name="password" 
          required 
          minLength={6} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        
        {/* 4. TAMBAHKAN CHECKBOX DI SINI */}
        <div className="flex items-center mt-2">
          <input
            id="show_password"
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="show_password" className="ml-2 block text-sm text-gray-900">
            Tampilkan password
          </label>
        </div>
      </div>

      {/* Input Role tidak berubah */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <select id="role" name="role" defaultValue="user" className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <SubmitButton />
      {state?.message && (
        <p className={`mt-2 text-sm ${state.error ? 'text-red-500' : 'text-green-500'}`}>
          {state.message}
        </p>
      )}
    </form>
  )
}