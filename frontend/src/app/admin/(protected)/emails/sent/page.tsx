import { prisma } from '@/lib/prisma'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

type StoredFile = { name: string; path: string }

export default async function AdminSent() {
  const sends = await prisma.sentEmail.findMany({ orderBy: { sentAt: 'desc' }, take: 100 })
  const supabase = getSupabaseAdmin()
  const links = await Promise.all(
    sends.map(async (s) => {
      const files = (s.attachments as StoredFile[] | null) || []
      const urls: Record<string, string> = {}
      if (supabase) {
        for (const f of files) {
          const { data } = await supabase.storage.from('email-attachments').createSignedUrl(f.path, 3600)
          if (data?.signedUrl) urls[f.path] = data.signedUrl
        }
      }
      return { id: s.id, urls }
    })
  )
  const urlFor = (id: string, path: string) => links.find((l) => l.id === id)?.urls[path] || null

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sent Mail</h2>
      <p className="text-sm text-gray-500 mb-6">Broadcasts dispatched from the composer, with archived attachments ({sends.length} stored).</p>
      {sends.length === 0 ? (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-12 text-center">
          <p className="text-gray-500 font-medium">Nothing sent yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sends.map((s) => {
            const files = (s.attachments as StoredFile[] | null) || []
            return (
              <div key={s.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{s.subject}</div>
                    <div className="text-sm text-gray-500">
                      From {s.fromName} &lt;{s.fromLocal}@gombestateaidsummit.ng&gt; • {s.recipientCount} recipient{s.recipientCount === 1 ? '' : 's'} • {s.audience}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap shrink-0">{s.sentAt.toLocaleString()}</div>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                    {files.map((f) => {
                      const url = urlFor(s.id, f.path)
                      return url ? (
                        <a key={f.path} href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 border border-emerald-200 rounded-lg px-3 py-1.5">
                          {f.name}
                        </a>
                      ) : (
                        <span key={f.path} className="text-xs font-semibold text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5">
                          {f.name}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
