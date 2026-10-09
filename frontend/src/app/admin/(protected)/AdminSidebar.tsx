'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAdmin } from '@/actions/admin-session'

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/registrations', label: 'Registrations' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/abstracts', label: 'Abstracts' },
  { href: '/admin/speakers', label: 'Speakers' },
  { href: '/admin/programme', label: 'Programme' },
  { href: '/admin/partners', label: 'Partners & Sponsors' },
  { href: '/admin/emails', label: 'Emails' },
  { href: '/admin/emails/sent', label: 'Sent' },
  { href: '/admin/emails/inbox', label: 'Inbox' },
  { href: '/admin/checkin', label: 'QR Check-in' },
]

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full lg:w-64 bg-emerald-950 text-white flex lg:flex-col shrink-0">
      <div className="px-4 py-3 lg:p-4 lg:border-b border-emerald-900 shrink-0 self-center lg:self-auto">
        <h2 className="text-base lg:text-xl font-bold tracking-tight whitespace-nowrap">Admin CMS</h2>
        <p className="text-xs text-emerald-400 mt-1 hidden lg:block">Gombe AIDS Summit</p>
      </div>
      <nav className="flex-1 overflow-x-auto lg:overflow-y-auto py-2 lg:py-4" aria-label="Admin sections">
        <ul className="flex lg:flex-col gap-1 px-2">
          {LINKS.map((l) => (
            <li key={l.href} className="shrink-0">
              <Link
                href={l.href}
                aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                className={`block px-4 py-2 rounded text-sm font-medium transition whitespace-nowrap ${
                  isActive(pathname, l.href) ? 'bg-emerald-800 text-white' : 'text-emerald-100/80 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-2 py-2 lg:p-4 lg:border-t border-emerald-900 shrink-0 self-center lg:self-auto">
        <form action={logoutAdmin}>
          <button type="submit" className="w-full text-left px-4 py-2 text-sm text-emerald-300 hover:text-white hover:bg-emerald-900 rounded transition whitespace-nowrap">
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
