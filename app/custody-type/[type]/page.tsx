import { getCustodyTypes, getCustodyType, getProvidersByType } from '@/lib/providers'
import { rankProviders, calculateCustodyScore } from '@/lib/scoring'
import { breadcrumbSchema } from '@/lib/seo'
import CustodyScoreBadge from '@/components/CustodyScoreBadge'
import Link from 'next/link'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return getCustodyTypes().map((t) => ({ type: t.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>
}): Promise<Metadata> {
  const { type } = await params
  const custodyType = getCustodyType(type)
  if (!custodyType) return {}

  return {
    title: `${custodyType.name} Bitcoin Custody — Reviews & Rankings`,
    description: `Compare the best ${custodyType.name.toLowerCase()} Bitcoin custody providers. Independent reviews, Custody Scores, pros & cons, and side-by-side rankings.`,
  }
}

const RELATED_GUIDES: Record<string, { slug: string; title: string; desc: string }[]> = {
  'multi-institution': [
    { slug: 'multi-institution-custody-explained', title: 'Multi-Institution Custody Explained', desc: 'Why distributing assets across multiple custodians eliminates single points of failure.' },
    { slug: 'how-to-choose-a-custodian', title: 'How to Choose a Custodian', desc: 'A framework for evaluating custody providers across security, insurance, fees, and compliance.' },
    { slug: 'what-is-bitcoin-custody', title: 'What is Bitcoin Custody?', desc: 'Everything you need to know about securing your Bitcoin.' },
  ],
  'self-custody': [
    { slug: 'what-is-bitcoin-custody', title: 'What is Bitcoin Custody?', desc: 'Everything you need to know about securing your Bitcoin.' },
    { slug: 'how-to-choose-a-custodian', title: 'How to Choose a Custodian', desc: 'A framework for evaluating custody providers across security, insurance, fees, and compliance.' },
    { slug: 'multi-institution-custody-explained', title: 'Multi-Institution Custody Explained', desc: 'Why distributing assets across multiple custodians eliminates single points of failure.' },
  ],
  'exchange-custody': [
    { slug: 'what-is-bitcoin-custody', title: 'What is Bitcoin Custody?', desc: 'Everything you need to know about securing your Bitcoin.' },
    { slug: 'how-to-choose-a-custodian', title: 'How to Choose a Custodian', desc: 'A framework for evaluating custody providers across security, insurance, fees, and compliance.' },
    { slug: 'multi-institution-custody-explained', title: 'Multi-Institution Custody Explained', desc: 'Why distributing assets across multiple custodians eliminates single points of failure.' },
  ],
  'qualified-custodian': [
    { slug: 'how-to-choose-a-custodian', title: 'How to Choose a Custodian', desc: 'A framework for evaluating custody providers across security, insurance, fees, and compliance.' },
    { slug: 'multi-institution-custody-explained', title: 'Multi-Institution Custody Explained', desc: 'Why distributing assets across multiple custodians eliminates single points of failure.' },
    { slug: 'what-is-bitcoin-custody', title: 'What is Bitcoin Custody?', desc: 'Everything you need to know about securing your Bitcoin.' },
  ],
  'cold-storage': [
    { slug: 'what-is-bitcoin-custody', title: 'What is Bitcoin Custody?', desc: 'Everything you need to know about securing your Bitcoin.' },
    { slug: 'how-to-choose-a-custodian', title: 'How to Choose a Custodian', desc: 'A framework for evaluating custody providers across security, insurance, fees, and compliance.' },
    { slug: 'multi-institution-custody-explained', title: 'Multi-Institution Custody Explained', desc: 'Why distributing assets across multiple custodians eliminates single points of failure.' },
  ],
  'collaborative-custody': [
    { slug: 'multi-institution-custody-explained', title: 'Multi-Institution Custody Explained', desc: 'Why distributing assets across multiple custodians eliminates single points of failure.' },
    { slug: 'how-to-choose-a-custodian', title: 'How to Choose a Custodian', desc: 'A framework for evaluating custody providers across security, insurance, fees, and compliance.' },
    { slug: 'what-is-bitcoin-custody', title: 'What is Bitcoin Custody?', desc: 'Everything you need to know about securing your Bitcoin.' },
  ],
}

const DEFAULT_GUIDES = [
  { slug: 'what-is-bitcoin-custody', title: 'What is Bitcoin Custody?', desc: 'Everything you need to know about securing your Bitcoin.' },
  { slug: 'how-to-choose-a-custodian', title: 'How to Choose a Custodian', desc: 'A framework for evaluating custody providers across security, insurance, fees, and compliance.' },
  { slug: 'multi-institution-custody-explained', title: 'Multi-Institution Custody Explained', desc: 'Why distributing assets across multiple custodians eliminates single points of failure.' },
]

export default async function CustodyTypePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const custodyType = getCustodyType(type)

  if (!custodyType) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-text-heading">Custody Type Not Found</h1>
        <p className="mt-4 text-text-body">The custody type you are looking for does not exist.</p>
        <Link href="/" className="mt-6 inline-block text-brand hover:underline">
          Back to Home
        </Link>
      </div>
    )
  }

  const providers = getProvidersByType(type)
  const ranked = rankProviders(providers)

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Custody Types', url: '/#custody-types' },
    { name: custodyType.name, url: `/custody-type/${type}` },
  ])

  const guides = RELATED_GUIDES[type] || DEFAULT_GUIDES

  return (
    <>
      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-200/60 bg-white">
        <div className="container-main py-3">
          <ol className="flex items-center gap-2 text-sm text-text-body">
            <li>
              <Link href="/" className="hover:text-brand transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center"><svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
            <li>
              <Link href="/#custody-types" className="hover:text-brand transition-colors">
                Custody Types
              </Link>
            </li>
            <li className="flex items-center"><svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
            <li>
              <span className="font-medium text-text-heading">{custodyType.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* H1 + Explainer */}
      <section className="gradient-hero relative overflow-hidden py-16 sm:py-20">
        <div className="hero-glow absolute inset-0" />
        <div className="container-main relative max-w-4xl">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {custodyType.name} — How It Works &amp; Best Providers
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-400">
            {custodyType.longDescription}
          </p>
        </div>
      </section>

      {/* Pros / Cons Table */}
      <section className="bg-bg-light py-12">
        <div className="container-main max-w-4xl">
          <p className="section-label text-left">Trade-offs</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-heading">Pros &amp; Cons</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Pros */}
            <div className="card">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-score-green">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-score-green/10 text-sm">
                  +
                </span>
                Pros
              </h3>
              <ul className="mt-4 space-y-3">
                {custodyType.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-text-body">
                    <span className="mt-0.5 text-score-green">&#10003;</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="card">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-score-red">
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-score-red/10 text-sm">
                  &minus;
                </span>
                Cons
              </h3>
              <ul className="mt-4 space-y-3">
                {custodyType.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-sm text-text-body">
                    <span className="mt-0.5 text-score-red">&#10007;</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Best For */}
      <section className="py-12">
        <div className="container-main max-w-4xl">
          <p className="section-label text-left">Ideal Users</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-heading">Best For</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {custodyType.bestFor.map((item) => (
              <span
                key={item}
                className="inline-block rounded-full border border-brand/20 bg-gradient-to-r from-brand/10 to-brand-light/50 shadow-sm px-4 py-2 text-sm font-medium text-brand"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Ranked Providers */}
      <section className="bg-bg-light py-12">
        <div className="container-main max-w-4xl">
          <p className="section-label text-left">Rankings</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-heading">
            Best {custodyType.name} Providers
          </h2>
          <p className="mt-2 text-sm text-text-body">
            Ranked by weighted Custody Score across 8 criteria.
          </p>

          {ranked.length === 0 ? (
            <p className="mt-8 text-text-body">
              No providers of this type are currently tracked. Check back soon.
            </p>
          ) : (
            <div className="mt-8 space-y-4">
              {ranked.map((provider) => (
                <div key={provider.id} className="card flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-dark shadow-md text-sm font-bold text-white">
                    {provider.rank}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <Link
                          href={`/custodian/${provider.slug}`}
                          className="text-lg font-semibold text-text-heading hover:text-brand transition-colors"
                        >
                          {provider.name}
                        </Link>
                      </div>
                      <CustodyScoreBadge score={provider.custodyScore} size="sm" showLabel />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text-body line-clamp-2">
                      {provider.description}
                    </p>
                    <Link
                      href={`/custodian/${provider.slug}`}
                      className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
                    >
                      Read full review &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison CTA */}
      <section className="py-12">
        <div className="container-main max-w-4xl text-center">
          <div className="card gradient-hero relative overflow-hidden p-8 sm:p-12 ring-0 border-0">
            <div className="hero-glow absolute inset-0" />
            <h2 className="relative text-2xl font-bold text-white">
              Compare {custodyType.name} Providers Side-by-Side
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-gray-300">
              Use our free comparison tool to evaluate {custodyType.name.toLowerCase()} providers across security, fees, insurance, and more.
            </p>
            <Link
              href="/tools/compare"
              className="btn-primary mt-6 text-base"
            >
              Compare {custodyType.name} providers side-by-side &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="bg-bg-light py-12">
        <div className="container-main max-w-4xl">
          <p className="section-label text-left">Learn More</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-heading">Related Guides</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="card group"
              >
                <h3 className="font-semibold text-text-heading group-hover:text-brand">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-body">
                  {guide.desc}
                </p>
                <p className="mt-3 flex items-center gap-1 text-xs font-medium text-brand">
                  Read more
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
