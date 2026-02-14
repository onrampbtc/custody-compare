import Link from 'next/link'
import { getProviders, getCustodyTypes, getMeta, getProvidersByType } from '@/lib/providers'
import { rankProviders } from '@/lib/scoring'
import CustodyScoreBadge from '@/components/CustodyScoreBadge'
import EmailCapture from '@/components/EmailCapture'
import { homePageSchema } from '@/lib/seo'

const CUSTODY_TYPE_ICONS: Record<string, { icon: JSX.Element; gradient: string; iconColor: string }> = {
  'multi-institution': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />,
    gradient: 'from-brand-50 to-emerald-50',
    iconColor: 'text-brand',
  },
  'self-custody': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
    gradient: 'from-amber-50 to-orange-50',
    iconColor: 'text-amber-600',
  },
  'exchange-custody': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    gradient: 'from-blue-50 to-cyan-50',
    iconColor: 'text-blue-600',
  },
  'qualified-custodian': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    gradient: 'from-emerald-50 to-green-50',
    iconColor: 'text-emerald-600',
  },
  'cold-storage': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    gradient: 'from-sky-50 to-indigo-50',
    iconColor: 'text-sky-600',
  },
  'collaborative-custody': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    gradient: 'from-rose-50 to-pink-50',
    iconColor: 'text-rose-600',
  },
  'etf-indirect': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    gradient: 'from-violet-50 to-purple-50',
    iconColor: 'text-violet-600',
  },
  'technology-provider': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    gradient: 'from-gray-50 to-slate-100',
    iconColor: 'text-gray-600',
  },
}

const TOOLS = [
  {
    href: '/tools/fee-calculator',
    name: 'Fee Calculator',
    desc: 'Compare annual custody costs across all providers based on your AUM.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    href: '/tools/risk-score',
    name: 'Custody Risk Quiz',
    desc: 'Answer 5 questions to find the right custody type and top providers.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    color: 'text-brand bg-brand-50',
  },
  {
    href: '/tools/compare',
    name: 'Head-to-Head Comparator',
    desc: 'Select 2-4 providers for a dynamic side-by-side comparison.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    href: '/tools/decision-tree',
    name: 'Decision Tree',
    desc: 'Follow a guided flowchart to your ideal custody solution.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />,
    color: 'text-purple-600 bg-purple-50',
  },
]

export default function HomePage() {
  const providers = getProviders()
  const types = getCustodyTypes()
  const meta = getMeta()
  const ranked = rankProviders(providers).slice(0, 10)
  const totalComparisons = Math.floor((providers.length * (providers.length - 1)) / 2)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema()) }}
      />

      {/* Hero - Clean White with Green Accents */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50/40 via-transparent to-transparent" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-brand-50/30 to-transparent" />

        <div className="container-main relative py-20 sm:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              Tracking {meta.totalProviders} custodians across 8 criteria
            </div>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-text-heading sm:text-5xl lg:text-hero">
              Compare Every Bitcoin{' '}
              <span className="text-brand">
                Custody Solution
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-body sm:text-xl">
              Independent reviews, transparent scoring, zero bias. Find the custody setup that fits your security needs and risk tolerance.
            </p>

            {/* Inline email capture */}
            <div className="mx-auto mt-10 max-w-md">
              <EmailCapture variant="inline" />
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/tools/compare" className="btn-primary text-base">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Compare Custodians
              </Link>
              <Link href="/tools/risk-score" className="btn-secondary text-base">
                Take the Risk Quiz
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-text-heading">{meta.totalProviders}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">Custodians</p>
            </div>
            <div className="border-x border-gray-100 text-center">
              <p className="text-3xl font-extrabold text-text-heading">8</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">Criteria</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-text-heading">{totalComparisons}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">Comparisons</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section id="custody-types" className="bg-bg-light py-20 sm:py-24">
        <div className="container-main">
          <p className="section-label">Explore</p>
          <h2 className="section-heading">Custody Types</h2>
          <p className="section-subheading">
            Distinct approaches to securing your Bitcoin — each with different trade-offs.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {types.map((t) => {
              const count = getProvidersByType(t.id).length
              const iconData = CUSTODY_TYPE_ICONS[t.id]
              return (
                <Link key={t.id} href={`/custody-type/${t.id}`} className="card group relative overflow-hidden">
                  <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${iconData?.gradient || 'from-gray-50 to-gray-100'} opacity-60 transition-transform duration-500 group-hover:scale-150`} />
                  <div className="relative">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${iconData?.gradient || 'from-gray-50 to-gray-100'}`}>
                      <svg className={`h-5 w-5 ${iconData?.iconColor || 'text-gray-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                        {iconData?.icon}
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-text-heading transition-colors group-hover:text-brand">{t.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-body/80">{t.shortDescription}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                      {count} provider{count !== 1 ? 's' : ''}
                      <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Top-Rated Table */}
      <section id="rankings" className="py-20 sm:py-24">
        <div className="container-main">
          <p className="section-label">Rankings</p>
          <h2 className="section-heading">Top-Rated Custody Providers</h2>
          <p className="section-subheading">
            Ranked by our weighted Custody Score&trade; across 8 criteria.
          </p>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-gray-200/80 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="py-4 pl-6 pr-2 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Rank</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Provider</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Type</th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Score</th>
                  <th className="hidden py-4 pl-4 pr-6 text-left text-xs font-bold uppercase tracking-wider text-gray-400 sm:table-cell">Key Strength</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 transition-colors duration-150 hover:bg-brand-50/30"
                  >
                    <td className="py-4 pl-6 pr-2">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        i === 0 ? 'bg-brand/10 text-brand ring-1 ring-brand/20' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        i === 2 ? 'bg-amber-50 text-amber-700' :
                        'text-gray-400'
                      }`}>
                        {p.rank}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/custodian/${p.slug}`} className="font-semibold text-text-heading transition-colors hover:text-brand">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block rounded-full bg-bg-light px-2.5 py-0.5 text-xs font-medium text-text-body">
                        {p.custodyTypeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <CustodyScoreBadge score={p.custodyScore} size="sm" />
                      </div>
                    </td>
                    <td className="hidden py-4 pl-4 pr-6 text-xs leading-relaxed text-text-body sm:table-cell">{p.pros[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="bg-bg-light py-20 sm:py-24">
        <div className="container-main">
          <p className="section-label">Free Tools</p>
          <h2 className="section-heading">Interactive Tools</h2>
          <p className="section-subheading">
            Find the right custody solution with our free, zero-signup tools.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="card group text-center">
                <div className={`mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tool.color} transition-transform duration-300 group-hover:scale-110`}>
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                    {tool.icon}
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-bold text-text-heading transition-colors group-hover:text-brand">{tool.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-text-body/80">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Preview */}
      <section className="py-20 sm:py-24">
        <div className="container-main">
          <p className="section-label">Learn</p>
          <h2 className="section-heading">Latest Guides</h2>
          <p className="section-subheading">
            Deep dives into Bitcoin custody best practices.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                slug: 'what-is-bitcoin-custody',
                title: 'What is Bitcoin Custody?',
                desc: 'Everything you need to know about securing your Bitcoin — from self-custody to institutional solutions.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
              },
              {
                slug: 'how-to-choose-a-custodian',
                title: 'How to Choose a Custodian',
                desc: 'A framework for evaluating custody providers across security, insurance, fees, and regulatory compliance.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
              },
              {
                slug: 'multi-institution-custody-explained',
                title: 'Multi-Institution Custody',
                desc: 'Why distributing assets across multiple custodians eliminates single points of failure.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
              },
            ].map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="card group">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                  <svg className="h-5 w-5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                    {g.icon}
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-bold text-text-heading transition-colors group-hover:text-brand">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-body/80">{g.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  Read guide
                  <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="pb-20 pt-4">
        <div className="container-main max-w-xl">
          <EmailCapture />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-t border-gray-200/60 bg-white py-8">
        <div className="container-main flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span><strong className="font-semibold text-text-heading">{meta.totalProviders}</strong> custodians tracked</span>
          </div>
          <span className="hidden h-4 w-px bg-gray-200 sm:block" />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span><strong className="font-semibold text-text-heading">8</strong> scoring criteria</span>
          </div>
          <span className="hidden h-4 w-px bg-gray-200 sm:block" />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-4 w-4 text-score-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated <strong className="font-semibold text-text-heading">{meta.lastUpdated}</strong></span>
          </div>
        </div>
      </section>
    </>
  )
}
