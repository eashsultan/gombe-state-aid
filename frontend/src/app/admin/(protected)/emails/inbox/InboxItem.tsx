'use client'

import { useState } from 'react'
import { getInboundEmailBody } from '@/actions/admin'

export type InboxMail = {
  id: string
  emailId: string | null
  receivedAt: string
  eventType: string
  from: string
  to: string
  subject: string
  raw: string
}

export default function InboxItem({ mail }: { mail: InboxMail }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [html, setHtml] = useState<string | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  const toggle = async () => {
    const next = !open
    setOpen(next)
    if (next && !loaded) {
      setLoading(true)
      setError('')
      if (!mail.emailId) {
        setError('No email reference stored for this message.')
      } else {
        const res = await getInboundEmailBody(mail.emailId)
        if (res.success) {
          setHtml(res.html || null)
          setText(res.text || null)
        } else {
          setError(res.error || 'Could not load content.')
        }
      }
      setLoaded(true)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-5">
      <button onClick={toggle} className="w-full text-left cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="font-bold text-gray-900 truncate">{mail.subject}</div>
            <div className="text-sm text-gray-500 truncate">
              From {mail.from}
              {mail.to ? ` to ${mail.to}` : ''}
            </div>
          </div>
          <div className="text-xs text-gray-400 whitespace-nowrap shrink-0">
            {mail.receivedAt} • {open ? 'Hide ▲' : 'Open ▼'}
          </div>
        </div>
      </button>
      {open && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          {loading && <p className="text-sm text-gray-500">Loading message...</p>}
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm font-semibold">{error}</div>}
          {!loading && !error && html && (
            <iframe title={`Email from ${mail.from}`} srcDoc={html} sandbox="" className="w-full h-[420px] bg-white border border-gray-100 rounded-xl" />
          )}
          {!loading && !error && !html && text && (
            <pre className="text-sm text-gray-800 bg-gray-50 border border-gray-100 rounded-xl p-4 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
              {text}
            </pre>
          )}
          <details>
            <summary className="text-xs font-bold uppercase tracking-widest text-gray-400 cursor-pointer">Raw payload</summary>
            <pre className="mt-2 text-xs bg-gray-50 border border-gray-100 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
              {mail.raw}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}
