'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkInRegistration, checkoutRegistration, updateRegistrationStatus } from '@/actions/admin'

export default function RegistrationActions({
  id,
  currentStatus,
  checkInStatus,
}: {
  id: string
  currentStatus: string
  checkInStatus: boolean
}) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const run = async (fn: () => Promise<{ success: boolean; error?: string }>) => {
    setIsUpdating(true)
    await fn()
    setIsUpdating(false)
    router.refresh()
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus !== 'CONFIRMED' && (
        <button
          onClick={() => run(() => updateRegistrationStatus(id, 'CONFIRMED'))}
          disabled={isUpdating}
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1 rounded text-xs font-semibold transition disabled:opacity-60"
        >
          Approve
        </button>
      )}
      {currentStatus !== 'REJECTED' && (
        <button
          onClick={() => run(() => updateRegistrationStatus(id, 'REJECTED'))}
          disabled={isUpdating}
          className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-xs font-semibold transition disabled:opacity-60"
        >
          Reject
        </button>
      )}
      {!checkInStatus ? (
        <button
          onClick={() => run(() => checkInRegistration(id))}
          disabled={isUpdating}
          className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-xs font-semibold transition disabled:opacity-60"
        >
          Check In
        </button>
      ) : (
        <button
          onClick={() => run(() => checkoutRegistration(id))}
          disabled={isUpdating}
          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs font-semibold transition disabled:opacity-60"
        >
          Check Out
        </button>
      )}
    </div>
  )
}
