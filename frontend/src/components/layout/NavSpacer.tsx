'use client';

import { usePathname } from 'next/navigation';

// The navbar is position:fixed, so pages need top offset - except the
// homepage, whose full-bleed hero carries its own top padding.
export default function NavSpacer() {
  const pathname = usePathname();
  if (!pathname || pathname === '/') return null;
  if (pathname.startsWith('/admin')) return null;
  return <div className="h-28 sm:h-32" aria-hidden="true" />;
}
