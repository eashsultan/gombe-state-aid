const BRAND = {
  deep: '#0A2518',
  deepSoft: '#123527',
  green: '#059669',
  mint: '#6EE7B7',
  accent: '#E11D48',
  accentSoft: '#FBE4E9',
  milk: '#FFFEF7',
  ink: '#1E293B',
  muted: '#64748B',
  line: '#E7E0D2',
}

export const VERIFIED_SENDER_DOMAIN = 'gombestateaidsummit.ng'

export function esc(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildSender(fromName?: string, localPart?: string) {
  const name = (fromName || 'Gombe Summit').trim() || 'Gombe Summit'
  const local = (localPart || 'updates').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '') || 'updates'
  return `${name} <${local}@${VERIFIED_SENDER_DOMAIN}>`
}

export function summitEmailShell(opts: { subject: string; heading: string; bodyHtml: string }) {
  const heading = esc(opts.heading)
  const preheader = esc(opts.subject)
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:${BRAND.milk};font-family:Georgia,'Times New Roman',serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <div style="max-width:620px;margin:0 auto;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="background-color:${BRAND.accent};border-radius:20px 20px 0 0;height:10px;line-height:10px;font-size:0;">&nbsp;</div>
      <div style="background-color:${BRAND.deep};padding:36px 32px 30px;text-align:center;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 18px;">
          <tr>
            <td style="background-color:${BRAND.green};border-radius:14px;width:56px;height:56px;text-align:center;vertical-align:middle;font-size:32px;font-weight:bold;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">+</td>
          </tr>
        </table>
        <div style="color:#ffffff;font-size:13px;font-weight:bold;letter-spacing:4px;margin-bottom:10px;">GOMBE STATE GOVERNMENT</div>
        <div style="color:#ffffff;font-size:26px;font-weight:900;letter-spacing:-0.5px;line-height:1.2;">2026 HIV-TB SUMMIT</div>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px auto 0;">
          <tr>
            <td style="border:1px solid ${BRAND.mint};border-radius:999px;padding:7px 18px;color:${BRAND.mint};font-size:11px;letter-spacing:2px;font-weight:bold;">1 DECEMBER 2026 &bull; WORLD AIDS DAY</td>
          </tr>
        </table>
      </div>
      <div style="background-color:#ffffff;padding:40px 36px;border-left:1px solid ${BRAND.line};border-right:1px solid ${BRAND.line};">
        <h1 style="color:${BRAND.deep};font-size:22px;margin:0 0 10px;line-height:1.35;">${heading}</h1>
        <div style="background-color:${BRAND.accent};height:4px;width:72px;border-radius:2px;margin:0 0 22px;font-size:0;">&nbsp;</div>
        <div style="color:${BRAND.ink};font-size:15.5px;line-height:1.8;">${opts.bodyHtml}</div>
      </div>
      <div style="background-color:${BRAND.deepSoft};border:1px solid ${BRAND.deepSoft};border-radius:0 0 20px 20px;padding:26px 32px;text-align:center;">
        <p style="color:${BRAND.mint};font-size:12px;letter-spacing:1.5px;font-weight:bold;margin:0 0 10px;">STRONGER PARTNERSHIPS FOR A HEALTHIER, HIV &amp; TB FREE GOMBE STATE</p>
        <p style="color:#94a3b8;font-size:12px;margin:0;">Gombe State Ministry of Health &bull; TB-HIV Summit Secretariat</p>
        <p style="color:#64748b;font-size:11px;margin:10px 0 0;">You received this email because you registered for the summit.</p>
      </div>
    </div>
  </body>
</html>`
}

export function plainToHtml(text: string) {
  return esc(text)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function parseCustomRecipients(raw: string): { valid: string[]; invalid: string[] } {
  const parts = raw.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean)
  const seen = new Set<string>()
  const valid: string[] = []
  const invalid: string[] = []
  for (const p of parts) {
    if (seen.has(p)) continue
    seen.add(p)
    if (EMAIL_RE.test(p)) valid.push(p)
    else invalid.push(p)
  }
  return { valid, invalid }
}
