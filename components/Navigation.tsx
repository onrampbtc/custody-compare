'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#custody-types', label: 'Custody Types' },
  { href: '/#rankings', label: 'Rankings' },
  { href: '/#tools', label: 'Tools' },
  { href: '/guides/what-is-bitcoin-custody', label: 'Guides' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-lg">
      <nav className="container-main flex h-[60px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-[17px] font-bold text-text-heading">
            Custody<span className="text-brand">Compare</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-text-body transition-colors duration-150 hover:bg-gray-100 hover:text-text-heading"
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-4">
            <Link href="/tools/compare" className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-all duration-150 hover:bg-brand-dark">
              Compare Now
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5 text-text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="animate-slide-up border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 px-3 pb-1">
            <Link href="/tools/compare" onClick={() => setOpen(false)} className="btn-primary block text-center text-sm">
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
