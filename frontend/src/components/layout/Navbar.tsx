'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programme', label: 'Programme' },
  { href: '/speakers', label: 'Speakers' },
  { href: '/abstracts', label: 'Abstracts' },
];

const linkCls =
  'text-emerald-100/80 hover:text-white font-bold text-sm uppercase tracking-wide transition-colors duration-300';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="fixed top-3 inset-x-3 sm:inset-x-6 z-50 rounded-[1.75rem] border border-white/10 bg-emerald-950 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center transform group-hover:-rotate-3 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <svg className="w-6 h-6 text-emerald-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase transition-colors">Gombe State Government</span>
              <span className="font-black text-xl sm:text-2xl text-white tracking-tight leading-none mt-0.5 truncate">
                HIV-TB SUMMIT<span className="text-rose-500">.</span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/abstracts/submit" className="text-sm font-bold text-emerald-100 hover:text-white transition-colors duration-300 uppercase tracking-wide">
              Submit Abstract
            </Link>
            <Link href="/register" className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)] hover:-translate-y-0.5">
              Register
            </Link>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              {open ? (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-white/10 px-2 pb-4 pt-2 max-h-[70vh] overflow-y-auto">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-white font-bold text-sm uppercase tracking-wide hover:bg-white/10 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 px-2 pt-2">
              <Link
                href="/abstracts/submit"
                onClick={() => setOpen(false)}
                className="text-center text-sm font-bold text-white uppercase tracking-wide border border-white/20 rounded-xl px-4 py-3"
              >
                Submit Abstract
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="text-center bg-rose-600 text-white px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-widest"
              >
                Register
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
