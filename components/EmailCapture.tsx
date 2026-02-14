'use client'

import { useState } from 'react'

interface Props {
  variant?: 'default' | 'inline' | 'dark'
}

export default function EmailCapture({ variant = 'default' }: Props) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={`rounded-xl p-6 text-center ${variant === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-brand-50 ring-1 ring-brand/10'}`}>
        <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full ${variant === 'dark' ? 'bg-brand/20' : 'bg-brand/10'}`}>
          <svg className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className={`text-base font-semibold ${variant === 'dark' ? 'text-white' : 'text-text-heading'}`}>You&apos;re subscribed.</p>
        <p className={`mt-1 text-sm ${variant === 'dark' ? 'text-gray-400' : 'text-text-body'}`}>We&apos;ll send custody intelligence. No spam.</p>
      </div>
    )
  }

  // Inline variant (for hero/top of page - compact horizontal)
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-heading shadow-sm transition-all placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <button type="submit" className="btn-primary whitespace-nowrap text-sm">
          Get Updates
        </button>
      </form>
    )
  }

  // Dark variant (for footer)
  if (variant === 'dark') {
    return (
      <div>
        <h4 className="text-sm font-semibold text-white">Stay informed</h4>
        <p className="mt-1 text-sm text-gray-400">Weekly custody intelligence. No spam.</p>
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-gray-500 transition-all focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30"
          />
          <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-light">
            Subscribe
          </button>
        </form>
      </div>
    )
  }

  // Default variant (standalone card)
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-8 text-center shadow-card sm:p-10">
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
        <svg className="h-5 w-5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-text-heading">Stay informed on Bitcoin custody</h3>
      <p className="mt-1.5 text-sm text-text-body">Weekly custody intelligence delivered to your inbox. No spam.</p>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-all placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:max-w-xs"
        />
        <button type="submit" className="btn-primary w-full whitespace-nowrap text-sm sm:w-auto">
          Subscribe
        </button>
      </form>
    </div>
  )
}
