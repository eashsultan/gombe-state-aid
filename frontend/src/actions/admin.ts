'use server'

import { prisma } from '@/lib/prisma'
import { getResend } from '@/lib/resend'
import { buildSender, parseCustomRecipients, plainToHtml, summitEmailShell } from '@/lib/email-templates'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function updateRegistrationStatus(id: string, status: string) {
  try {
    await prisma.registration.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/admin/registrations')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error updating registration:', error)
    return { success: false, error: 'Failed to update registration' }
  }
}

export async function updateAbstractStatus(id: string, status: string) {
  try {
    await prisma.abstract.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/admin/abstracts')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error updating abstract:', error)
    return { success: false, error: 'Failed to update abstract' }
  }
}

export type SpeakerInput = {
  name: string
  title?: string | null
  organization?: string | null
  country?: string | null
  biography?: string | null
  photoUrl?: string | null
  category?: string | null
  published?: boolean
  order?: number
}

function toSpeakerData(data: SpeakerInput) {
  return {
    name: data.name,
    title: data.title || null,
    organization: data.organization || null,
    country: data.country || null,
    biography: data.biography || null,
    photoUrl: data.photoUrl || null,
    category: data.category || null,
    published: data.published ?? false,
    order: Number(data.order ?? 0),
  }
}

export async function createSpeaker(data: SpeakerInput) {
  try {
    await prisma.speaker.create({ data: toSpeakerData(data) })
    revalidatePath('/admin/speakers')
    return { success: true }
  } catch (error) {
    console.error('Error creating speaker:', error)
    return { success: false, error: 'Failed to create speaker' }
  }
}

export async function updateSpeaker(id: string, data: SpeakerInput) {
  try {
    await prisma.speaker.update({ where: { id }, data: toSpeakerData(data) })
    revalidatePath('/admin/speakers')
    return { success: true }
  } catch (error) {
    console.error('Error updating speaker:', error)
    return { success: false, error: 'Failed to update speaker' }
  }
}

export async function deleteSpeaker(id: string) {
  try {
    await prisma.speaker.delete({ where: { id } })
    revalidatePath('/admin/speakers')
    return { success: true }
  } catch (error) {
    console.error('Error deleting speaker:', error)
    return { success: false, error: 'Failed to delete speaker' }
  }
}

export type CheckInSummary = {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  organization: string | null
  participantCategory: string | null
  status: string
  checkInStatus: boolean
  checkInTime: string | null
  checkInCount: number
}

export async function lookupRegistration(query: string): Promise<{ success: boolean; participant?: CheckInSummary; error?: string }> {
  const q = query.trim()
  if (!q) return { success: false, error: 'Enter a registration ID or email.' }
  try {
    const reg = await prisma.registration.findFirst({
      where: { OR: [{ id: q }, { email: q }] },
      include: { _count: { select: { checkIns: true } } },
    })
    if (!reg) return { success: false, error: 'No registration found.' }
    return {
      success: true,
      participant: {
        id: reg.id,
        firstName: reg.firstName,
        lastName: reg.lastName,
        email: reg.email,
        phoneNumber: reg.phoneNumber,
        organization: reg.organization,
        participantCategory: reg.participantCategory,
        status: reg.status,
        checkInStatus: reg.checkInStatus,
        checkInTime: reg.checkInTime ? reg.checkInTime.toISOString() : null,
        checkInCount: reg._count.checkIns,
      },
    }
  } catch (error) {
    console.error('Error looking up registration:', error)
    return { success: false, error: 'Lookup failed.' }
  }
}

export async function checkInRegistration(id: string) {
  try {
    const reg = await prisma.registration.findUnique({ where: { id } })
    if (!reg) return { success: false, error: 'Registration not found.' }
    await prisma.registration.update({
      where: { id },
      data: { checkInStatus: true, checkInTime: new Date() },
    })
    await prisma.checkIn.create({ data: { registrationId: id, scannedBy: 'admin' } })
    revalidatePath('/admin/checkin')
    revalidatePath('/admin/registrations')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error checking in:', error)
    return { success: false, error: 'Check-in failed.' }
  }
}

export async function checkoutRegistration(id: string) {
  try {
    const reg = await prisma.registration.findUnique({ where: { id } })
    if (!reg) return { success: false, error: 'Registration not found.' }
    await prisma.registration.update({
      where: { id },
      data: { checkInStatus: false, checkInTime: null },
    })
    revalidatePath('/admin/checkin')
    revalidatePath('/admin/registrations')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error checking out:', error)
    return { success: false, error: 'Check-out failed.' }
  }
}

export type EmailAudience = 'all' | 'CONFIRMED' | 'PENDING' | 'custom'

export type SendEmailInput = {
  audience: EmailAudience
  customTo?: string
  fromName?: string
  fromLocal?: string
  subject: string
  message: string
  files?: File[]
}

const ATTACH_MAX_FILES = 3
const ATTACH_MAX_BYTES = 5 * 1024 * 1024
const ATTACH_BLOCKED = ['exe', 'bat', 'cmd', 'com', 'scr', 'ps1', 'sh', 'js', 'msi']

function validateAttachments(files: File[]): { ok: boolean; error?: string } {
  if (files.length > ATTACH_MAX_FILES) {
    return { ok: false, error: `Attach at most ${ATTACH_MAX_FILES} files.` }
  }
  let total = 0
  for (const f of files) {
    const ext = (f.name.split('.').pop() || '').toLowerCase()
    if (ATTACH_BLOCKED.includes(ext)) {
      return { ok: false, error: `"${f.name}" is not an allowed file type.` }
    }
    if (f.size > ATTACH_MAX_BYTES) {
      return { ok: false, error: `"${f.name}" exceeds 5 MB.` }
    }
    total += f.size
  }
  if (total > 9 * 1024 * 1024) {
    return { ok: false, error: 'Attachments total more than 9 MB.' }
  }
  return { ok: true }
}

export async function getInboundEmailBody(emailId: string): Promise<{ success: boolean; html?: string; text?: string; error?: string }> {
  const resend = getResend()
  if (!resend) {
    return { success: false, error: 'Email service is not configured (RESEND_API_KEY missing).' }
  }
  if (!emailId) return { success: false, error: 'No email reference stored.' }
  try {
    const { data, error } = await resend.emails.get(emailId)
    if (error || !data) {
      return { success: false, error: typeof error?.message === 'string' ? error.message : 'Could not fetch email content.' }
    }
    const html = typeof data.html === 'string' ? data.html : undefined
    const text = typeof data.text === 'string' ? data.text : undefined
    if (!html && !text) return { success: false, error: 'No readable content stored for this email.' }
    return { success: true, html, text }
  } catch (err) {
    console.error('Error fetching inbound email:', err)
    return { success: false, error: 'Could not fetch email content.' }
  }
}

export async function previewSummitEmail(input: { subject: string; message: string }) {
  const subject = input.subject.trim() || '(No subject)'
  const message = input.message.trim()
  if (!message) return { success: false, error: 'Write a message to preview.' }
  return { success: true, html: summitEmailShell({ subject, heading: subject, bodyHtml: plainToHtml(message) }) }
}

export async function sendSummitEmail(input: SendEmailInput) {
  const resend = getResend()
  if (!resend) {
    return { success: false, sent: 0, failed: 0, error: 'Email service is not configured (RESEND_API_KEY missing).' }
  }
  const subject = input.subject.trim()
  const message = input.message.trim()
  if (!subject || !message) {
    return { success: false, sent: 0, failed: 0, error: 'Subject and message are required.' }
  }
  try {
    let emails: string[]
    if (input.audience === 'custom') {
      const { valid, invalid } = parseCustomRecipients(input.customTo || '')
      if (valid.length === 0) {
        return { success: false, sent: 0, failed: 0, error: 'No valid custom addresses.' }
      }
      if (invalid.length > 0) {
        return { success: false, sent: 0, failed: 0, error: `Invalid addresses: ${invalid.slice(0, 5).join(', ')}` }
      }
      emails = valid
    } else {
      const recipients = await prisma.registration.findMany({
        where: input.audience === 'all' ? {} : { status: input.audience },
        select: { email: true },
      })
      emails = recipients.map((r) => r.email)
    }
    if (emails.length === 0) {
      return { success: false, sent: 0, failed: 0, error: 'No recipients in this audience.' }
    }
    const html = summitEmailShell({ subject, heading: subject, bodyHtml: plainToHtml(message) })
    const from = buildSender(input.fromName, input.fromLocal)
    const files = (input.files || []).filter((f) => f && f.size > 0)
    const check = validateAttachments(files)
    if (!check.ok) {
      return { success: false, sent: 0, failed: 0, error: check.error }
    }
    const buffers = await Promise.all(
      files.map(async (f) => ({ name: f.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120), content: Buffer.from(await f.arrayBuffer()) }))
    )
    // Archive to private bucket + record the send before dispatching.
    const record = await prisma.sentEmail.create({
      data: {
        subject,
        fromName: (input.fromName || 'Gombe Summit').trim() || 'Gombe Summit',
        fromLocal: (input.fromLocal || 'updates').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '') || 'updates',
        audience: input.audience,
        recipientCount: emails.length,
        recipients: emails.slice(0, 500),
        attachments: [],
      },
    })
    const storedPaths: Array<{ name: string; path: string }> = []
    const supabase = getSupabaseAdmin()
    if (buffers.length > 0) {
      if (!supabase) {
        await prisma.sentEmail.delete({ where: { id: record.id } })
        return { success: false, sent: 0, failed: 0, error: 'File archive is not configured. Remove attachments or try later.' }
      }
      for (const b of buffers) {
        const path = `sent/${record.id}/${b.name}`
        const { error: uploadError } = await supabase.storage.from('email-attachments').upload(path, b.content, { upsert: true })
        if (uploadError) {
          console.error('Attachment archive error:', uploadError)
          await prisma.sentEmail.delete({ where: { id: record.id } })
          return { success: false, sent: 0, failed: 0, error: 'Attachment archiving failed. Please try again.' }
        }
        storedPaths.push({ name: b.name, path })
      }
      await prisma.sentEmail.update({ where: { id: record.id }, data: { attachments: storedPaths } })
    }
    const attachments = buffers.map((b) => ({ filename: b.name, content: b.content }))
    let sent = 0
    let failed = 0
    let firstError = ''
    for (let i = 0; i < emails.length; i += 10) {
      const chunk = emails.slice(i, i + 10)
      const results = await Promise.allSettled(
        chunk.map((email) =>
          resend.emails.send({ from, to: email, subject, html, attachments: attachments.length ? attachments : undefined })
        )
      )
      for (const res of results) {
        if (res.status === 'fulfilled' && !res.value.error) {
          sent += 1
        } else {
          failed += 1
          if (!firstError) {
            firstError =
              (res.status === 'fulfilled' && (res.value.error as { message?: string } | null)?.message) ||
              (res.status === 'rejected' ? String(res.reason) : 'Unknown error')
          }
        }
      }
    }
    revalidatePath('/admin/emails')
    if (failed > 0) {
      return { success: false, sent, failed, error: `Resend rejected the send: ${firstError}` }
    }
    return { success: true, sent, failed }
  } catch (error) {
    console.error('Error sending summit email:', error)
    return { success: false, sent: 0, failed: 0, error: 'Failed to send emails.' }
  }
}

export type PartnerInput = {
  name: string
  description?: string | null
  category?: string | null
  logoUrl?: string | null
  websiteUrl?: string | null
  order?: number
  published?: boolean
}

function toPartnerData(data: PartnerInput) {
  return {
    name: data.name,
    description: data.description || null,
    category: data.category || null,
    logoUrl: data.logoUrl || null,
    websiteUrl: data.websiteUrl || null,
    order: Number(data.order ?? 0),
    published: data.published ?? false,
  }
}

export async function createPartner(kind: 'partner' | 'sponsor', data: PartnerInput) {
  try {
    const d = toPartnerData(data)
    if (kind === 'partner') await prisma.partner.create({ data: d })
    else await prisma.sponsor.create({ data: d })
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (error) {
    console.error('Error creating partner:', error)
    return { success: false, error: 'Failed to save.' }
  }
}

export async function updatePartner(kind: 'partner' | 'sponsor', id: string, data: PartnerInput) {
  try {
    const d = toPartnerData(data)
    if (kind === 'partner') await prisma.partner.update({ where: { id }, data: d })
    else await prisma.sponsor.update({ where: { id }, data: d })
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (error) {
    console.error('Error updating partner:', error)
    return { success: false, error: 'Failed to save.' }
  }
}

export async function deletePartner(kind: 'partner' | 'sponsor', id: string) {
  try {
    if (kind === 'partner') await prisma.partner.delete({ where: { id } })
    else await prisma.sponsor.delete({ where: { id } })
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (error) {
    console.error('Error deleting partner:', error)
    return { success: false, error: 'Failed to delete.' }
  }
}

export type SessionInput = {
  title: string
  description?: string | null
  startTime?: string | null
  endTime?: string | null
  room?: string | null
  sessionType?: string | null
  track?: string | null
  moderator?: string | null
  published?: boolean
  speakerIds?: string[]
}

function toSessionData(data: SessionInput) {
  const dt = (v?: string | null) => (v ? new Date(v) : null)
  return {
    title: data.title,
    description: data.description || null,
    startTime: dt(data.startTime),
    endTime: dt(data.endTime),
    room: data.room || null,
    sessionType: data.sessionType || null,
    track: data.track || null,
    moderator: data.moderator || null,
    published: data.published ?? false,
  }
}

export async function createSession(data: SessionInput) {
  try {
    const session = await prisma.session.create({ data: toSessionData(data) })
    if (data.speakerIds?.length) {
      await prisma.sessionSpeaker.createMany({
        data: data.speakerIds.map((speakerId) => ({ sessionId: session.id, speakerId })),
      })
    }
    revalidatePath('/admin/programme')
    return { success: true }
  } catch (error) {
    console.error('Error creating session:', error)
    return { success: false, error: 'Failed to save.' }
  }
}

export async function updateSession(id: string, data: SessionInput) {
  try {
    await prisma.session.update({ where: { id }, data: toSessionData(data) })
    await prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } })
    if (data.speakerIds?.length) {
      await prisma.sessionSpeaker.createMany({
        data: data.speakerIds.map((speakerId) => ({ sessionId: id, speakerId })),
      })
    }
    revalidatePath('/admin/programme')
    return { success: true }
  } catch (error) {
    console.error('Error updating session:', error)
    return { success: false, error: 'Failed to save.' }
  }
}

export async function deleteSession(id: string) {
  try {
    await prisma.session.delete({ where: { id } })
    revalidatePath('/admin/programme')
    return { success: true }
  } catch (error) {
    console.error('Error deleting session:', error)
    return { success: false, error: 'Failed to delete.' }
  }
}
