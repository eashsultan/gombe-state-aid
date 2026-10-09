import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

// Receiving webhook for Resend inbound email (frontend service, which boots
// reliably - the backend /api/* service is down). Subscribe in Resend to:
//   https://www.gombestateaidsummit.ng/webhooks/email/inbound
// and set RESEND_WEBHOOK_SECRET on the frontend service.
export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    return Response.json({ error: 'Inbound email not configured.' }, { status: 500 })
  }
  const payload = await req.text()
  const headers = {
    'svix-id': req.headers.get('svix-id') || '',
    'svix-timestamp': req.headers.get('svix-timestamp') || '',
    'svix-signature': req.headers.get('svix-signature') || '',
  }
  let event: { type?: string; data?: any }
  try {
    event = JSON.parse(payload)
  } catch {
    return Response.json({ error: 'Invalid payload.' }, { status: 400 })
  }
  try {
    new Webhook(secret).verify(payload, headers)
  } catch {
    return Response.json({ error: 'Invalid signature.' }, { status: 400 })
  }
  try {
    const eventType = typeof event.type === 'string' ? event.type : ''
    if (eventType && eventType !== 'email.received') {
      return Response.json({ received: true, skipped: eventType })
    }
    await prisma.auditLog.create({
      data: {
        action: 'INBOUND_EMAIL',
        entityType: 'EMAIL',
        entityId: typeof event.data?.email_id === 'string' ? event.data.email_id : null,
        details: { type: event.type || 'unknown', data: event.data || {} },
      },
    })
  } catch (error) {
    console.error('Failed to log inbound email:', error)
    const e = error as { code?: unknown; errorCode?: unknown; name?: unknown; message?: unknown }
    const code = String(e.code ?? e.errorCode ?? e.name ?? 'unknown')
    const detail = String(e.message || '')
      .replace(/:[^:@\s]+@/g, ':***@')
      .replace(/whsec_[A-Za-z0-9]+/g, 'whsec_***')
      .replace(/re_[A-Za-z0-9_]+/g, 're_***')
      .slice(0, 160)
    return Response.json({ error: 'Failed to store inbound email.', code, detail }, { status: 500 })
  }
  return Response.json({ received: true })
}
