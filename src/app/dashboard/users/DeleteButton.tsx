'use client'

import { useTransition } from 'react'
import { deleteUser } from './actions'

export default function DeleteButton({ userId }: { userId: string }) {
  let [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (window.confirm('Are you sure to kick this user?')) {
      startTransition(async () => {
        const result = await deleteUser(userId)
        if (result?.message) {
          alert(result.message)
        }
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-900 disabled:text-gray-400"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}