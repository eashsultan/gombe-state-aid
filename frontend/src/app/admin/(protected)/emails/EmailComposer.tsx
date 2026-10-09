'use client'

import { useState } from 'react'
import { previewSummitEmail, sendSummitEmail, type EmailAudience } from '@/actions/admin'

export default function EmailComposer() {
  const [audience, setAudience] = useState<EmailAudience>('CONFIRMED')
  const [customTo, setCustomTo] = useState('')
  const [fromName, setFromName] = useState('Gombe Summit')
  const [fromLocal, setFromLocal] = useState('updates')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [result, setResult] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const handlePreview = async () => {
    const res = await previewSummitEmail({ subject, message })
    if (res.success && res.html) {
      setPreviewHtml(res.html)
      setShowPreview(true)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const target = audience === 'custom' ? 'the custom addresses' : `${audience} registrants`
    if (!confirm(`Send this email to ${target}?`)) return
    setStatus('sending')
    setResult('')
    const res = await sendSummitEmail({ audience, customTo, fromName, fromLocal, subject, message, files })
    if (res.success) {
      setStatus('done')
      setResult(`Sent to ${res.sent} recipient${res.sent === 1 ? '' : 's'}.`)
      setSubject('')
      setMessage('')
      setCustomTo('')
      setFiles([])
    } else {
      setStatus('error')
      setResult(res.error || `Sent ${res.sent}, failed ${res.failed}.`)
    }
  }

  const input = 'w-full rounded-xl border border-gray-300 p-3 bg-gray-50 text-sm focus:border-emerald-500 focus:ring-emerald-500 transition-all'

  return (
    <div className="space-y-5">
      <form onSubmit={handleSend} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Recipients</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(['CONFIRMED', 'PENDING', 'all', 'custom'] as EmailAudience[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAudience(a)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition ${
                  audience === a ? 'bg-emerald-950 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {a === 'all' ? 'All' : a === 'custom' ? 'Custom' : a.charAt(0) + a.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          {audience === 'custom' && (
            <textarea
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              required
              rows={3}
              placeholder="one@example.com, two@example.com (comma or line separated)"
              className={input}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Sender name</label>
            <input value={fromName} onChange={(e) => setFromName(e.target.value)} maxLength={60} className={input} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Sender address</label>
            <div className="flex items-center gap-1">
              <input value={fromLocal} onChange={(e) => setFromLocal(e.target.value)} maxLength={40} className={`${input} flex-1 min-w-0`} />
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">@gombestateaidsummit.ng</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} required maxLength={120} placeholder="Summit update" className={input} />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={8} placeholder="Write your announcement. Blank lines become paragraphs." className={input} />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Attachments (max 3, 5 MB each)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 3))}
            className="w-full rounded-xl border border-gray-300 p-2.5 bg-gray-50 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-950 file:text-white file:text-xs file:font-bold hover:file:bg-emerald-900 transition-all"
          />
          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                  <span className="font-semibold text-gray-700 truncate">{f.name} ({(f.size / 1024).toFixed(0)} KB)</span>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, j) => j !== i))}
                    className="text-red-600 hover:text-red-800 font-bold ml-3"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {result && (
          <div className={`${status === 'done' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'} p-3 rounded-xl text-sm font-semibold`}>
            {result}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePreview}
            className="bg-white border border-slate-300 text-emerald-950 font-bold py-3 px-8 rounded-xl text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-3 px-8 rounded-xl text-sm uppercase tracking-widest transition disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending...' : 'Send Branded Email'}
          </button>
        </div>
      </form>

      {showPreview && previewHtml && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Email preview</span>
            <button onClick={() => setShowPreview(false)} className="text-xs font-bold text-gray-500 hover:text-gray-800">
              Close
            </button>
          </div>
          <iframe title="Email preview" srcDoc={previewHtml} className="w-full h-[480px] bg-white" sandbox="" />
        </div>
      )}
    </div>
  )
}
