import { prisma } from '@/lib/prisma'
import InboxItem, { type InboxMail } from './InboxItem'

export const dynamic = 'force-dynamic'

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function parseMail(id: string, emailId: string | null, receivedAt: Date, details: unknown): InboxMail {
  const root = asRecord(details)
  const data = asRecord(root.data ?? root)
  const headers = asRecord(data.headers)
  const from = str(data.from || headers.from || data.sender || 'Unknown sender')
  const to = str(
    Array.isArray(data.to) ? data.to.join(', ') : data.to || headers.to || ''
  )
  const subject = str(data.subject || headers.subject || '(no subject)')
  let raw = ''
  try {
    raw = JSON.stringify(details, null, 2)
  } catch {
    raw = String(details)
  }
  return {
    id,
    emailId,
    receivedAt: receivedAt.toLocaleString(),
    eventType: str(root.type) || 'email',
    from,
    to,
    subject,
    raw,
  }
}

export default async function AdminInbox() {
  const logs = await prisma.auditLog.findMany({
    where: { action: 'INBOUND_EMAIL' },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  const mails = logs.map((log) => parseMail(log.id, log.entityId, log.createdAt, log.details))

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Received Mail</h2>
      <p className="text-sm text-gray-500 mb-6">
        Inbound mail stored from the Resend receiving webhook ({mails.length} stored).
      </p>
      {mails.length === 0 ? (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-12 text-center">
          <p className="text-gray-500 font-medium">No received mail stored yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Point Resend receiving at /webhooks/email/inbound and replies will land here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mails.map((mail) => (
            <InboxItem key={mail.id} mail={mail} />
          ))}
        </div>
      )}
    </div>
  )
}
