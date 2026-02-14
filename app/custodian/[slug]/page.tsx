import { Metadata } from 'next'
import Link from 'next/link'
import { getProviders, getProvider, getProvidersByType, Provider, CustodyScores } from '@/lib/providers'
import {
  calculateCustodyScore,
  getScoreColor,
  getScoreLabel,
  getHighestCategory,
  getLowestCategory,
  SCORE_CRITERIA,
  rankProviders,
} from '@/lib/scoring'
import { getScoringWeights } from '@/lib/providers'
import { providerPageSchema, breadcrumbSchema, faqSchema } from '@/lib/seo'
import CustodyScoreBadge from '@/components/CustodyScoreBadge'
import ScoreRadar from '@/components/ScoreRadar'

export function generateStaticParams() {
  return getProviders().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const provider = getProvider(slug)
  if (!provider) {
    return { title: 'Provider Not Found' }
  }
  return {
    title: `${provider.name} Review 2026 — Fees, Security & Custody Score`,
    description: `Independent ${provider.name} custody review. Custody Score ${calculateCustodyScore(provider.scores)}/10 across security, fees, insurance & more.`,
  }
}

function generateFaqs(provider: Provider) {
  const score = calculateCustodyScore(provider.scores)
  const label = getScoreLabel(score)
  const faqs: { question: string; answer: string }[] = [
    {
      question: `Is ${provider.name} safe for Bitcoin custody?`,
      answer: `${provider.name} has a Custody Score of ${score}/10 (${label}). It uses ${provider.security.keyManagementType} key management with ${provider.security.coldStoragePercent} cold storage and holds ${provider.security.socCompliance} compliance.`,
    },
    {
      question: `What are ${provider.name} custody fees?`,
      answer: `${provider.name} charges ${provider.fees.custodyAnnual} annual custody fee with ${provider.fees.transaction} per transaction. Setup fee is ${provider.fees.setup}. ${provider.fees.notes}`,
    },
    {
      question: `Is ${provider.name} a qualified custodian?`,
      answer: provider.regulatory.qualifiedCustodian
        ? `Yes, ${provider.name} is a qualified custodian regulated in ${provider.regulatory.jurisdiction} with licenses including ${provider.regulatory.licenses.join(', ')}.`
        : `${provider.name} is not classified as a qualified custodian. It operates under ${provider.regulatory.jurisdiction} jurisdiction with ${provider.regulatory.licenses.join(', ')}.`,
    },
    {
      question: `What insurance does ${provider.name} provide?`,
      answer: `${provider.name} offers ${provider.insurance.coverage} in insurance coverage through ${provider.insurance.carrier}. ${provider.insurance.details}`,
    },
    {
      question: `How does ${provider.name} compare to other custodians?`,
      answer: `With a Custody Score of ${score}/10, ${provider.name} is rated ${label}. Its strongest area is ${getHighestCategory(provider.scores)} and its weakest is ${getLowestCategory(provider.scores)}.`,
    },
  ]
  return faqs
}

export default async function CustodianPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const provider = getProvider(slug)

  if (!provider) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold">Provider Not Found</h1>
        <p className="mt-4 text-text-body">The custodian you are looking for does not exist.</p>
        <Link href="/" className="btn-primary mt-6 inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  const score = calculateCustodyScore(provider.scores)
  const scoreLabel = getScoreLabel(score)
  const highest = getHighestCategory(provider.scores)
  const lowest = getLowestCategory(provider.scores)
  const weights = getScoringWeights()
  const faqs = generateFaqs(provider)

  // Rank among same-type providers
  const sameTypeProviders = getProvidersByType(provider.custodyType)
  const rankedSameType = rankProviders(sameTypeProviders)
  const providerRank = rankedSameType.find((p) => p.slug === provider.slug)
  const rank = providerRank?.rank ?? 0
  const totalSameType = rankedSameType.length

  // Top 5 alternatives (same type, excluding current)
  const alternatives = rankedSameType.filter((p) => p.slug !== provider.slug).slice(0, 5)

  // Breadcrumb items
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Custodians', url: '/' },
    { name: provider.name, url: `/custodian/${provider.slug}` },
  ]

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            providerPageSchema(provider),
            breadcrumbSchema(breadcrumbs),
            faqSchema(faqs),
          ]),
        }}
      />

      {/* Breadcrumbs */}
      <nav className="border-b border-gray-200/60 bg-white py-3" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2 text-sm text-text-body">
            <li>
              <Link href="/" className="hover:text-brand">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              <Link href="/" className="hover:text-brand">
                Custodians
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              <span className="font-medium text-text-heading">{provider.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Header Card */}
      <section className="gradient-hero relative overflow-hidden py-14">
        <div className="absolute inset-0 hero-glow" />
        <div className="container-main relative">
          <div className="card relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <CustodyScoreBadge score={score} size="lg" showLabel />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-text-heading sm:text-3xl">
                  {provider.name}
                </h1>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                  {provider.custodyTypeLabel}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-body">
                {provider.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-body">
                <span>
                  <strong className="text-text-heading">Founded:</strong> {provider.founded}
                </span>
                <span>
                  <strong className="text-text-heading">HQ:</strong> {provider.headquarters}
                </span>
                <span>
                  <strong className="text-text-heading">AUM:</strong> {provider.aum}
                </span>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="font-medium text-brand hover:underline"
                >
                  Visit Website &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Verdict */}
      <section className="py-10">
        <div className="container-main">
          <div className="rounded-2xl border border-brand/20 bg-gradient-to-r from-brand/5 to-brand-light/50 p-6 ring-1 ring-brand/10">
            <h2 className="text-lg font-bold text-text-heading">Quick Verdict</h2>
            <p className="mt-2 text-text-body leading-relaxed">
              With a Custody Score of <strong>{score}/10</strong>, {provider.name} is ranked{' '}
              <strong>
                #{rank} of {totalSameType}
              </strong>{' '}
              among {provider.custodyTypeLabel.toLowerCase()} providers. Its strongest category is{' '}
              <strong>{highest}</strong> and its weakest is <strong>{lowest}</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Score Breakdown */}
      <section className="bg-bg-light py-12">
        <div className="container-main">
          <p className="section-label">Analysis</p>
          <h2 className="section-heading text-left sm:text-center">Score Breakdown</h2>
          <p className="mt-2 text-sm text-text-body">
            The Custody Score is a weighted average across 8 criteria, each rated 1-10.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="flex justify-center">
              <ScoreRadar scores={provider.scores} />
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white ring-1 ring-gray-900/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="py-3 pr-4 pl-4 text-xs font-bold uppercase tracking-wider text-gray-400">Criterion</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Score</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Weight</th>
                    <th className="py-3 pl-4 pr-4 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
                      Weighted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SCORE_CRITERIA.map((criterion, i) => {
                    const s = provider.scores[criterion.key]
                    const w = weights[criterion.key]
                    const weighted = Math.round(s * w * 100) / 100
                    return (
                      <tr
                        key={criterion.key}
                        className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                      >
                        <td className="py-3 pr-4 font-medium text-text-heading">
                          {criterion.label}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className="inline-block rounded px-2 py-0.5 text-xs font-bold text-white"
                            style={{ backgroundColor: getScoreColor(s) }}
                          >
                            {s}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-text-body">
                          {(w * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 pl-4 text-center font-mono font-semibold text-text-heading">
                          {weighted.toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-3 pr-4 font-bold text-text-heading">Total</td>
                    <td />
                    <td className="px-4 py-3 text-center font-mono font-semibold">100%</td>
                    <td className="py-3 pl-4 text-center font-mono text-lg font-bold text-brand">
                      {score}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12">
        <div className="container-main">
          <h2 className="text-2xl font-extrabold tracking-tight">Key Features</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {provider.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs text-brand">
                  &#10003;
                </span>
                <span className="text-text-body">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fee Breakdown */}
      <section className="bg-bg-light py-12">
        <div className="container-main">
          <h2 className="text-2xl font-extrabold tracking-tight">Fee Breakdown</h2>
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white ring-1 ring-gray-900/5 p-1">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                    <td className="py-3 pr-4 pl-4 font-medium text-text-heading">Setup Fee</td>
                    <td className="py-3 pr-4 font-mono text-text-body">{provider.fees.setup}</td>
                  </tr>
                  <tr className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                    <td className="py-3 pr-4 pl-4 font-medium text-text-heading">Annual Custody Fee</td>
                    <td className="py-3 pr-4 font-mono text-text-body">{provider.fees.custodyAnnual}</td>
                  </tr>
                  <tr className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                    <td className="py-3 pr-4 pl-4 font-medium text-text-heading">Transaction Fee</td>
                    <td className="py-3 pr-4 font-mono text-text-body">{provider.fees.transaction}</td>
                  </tr>
                  <tr className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                    <td className="py-3 pr-4 pl-4 font-medium text-text-heading">Withdrawal Fee</td>
                    <td className="py-3 pr-4 font-mono text-text-body">{provider.fees.withdrawal}</td>
                  </tr>
                  {provider.fees.notes && (
                    <tr className="transition-colors hover:bg-gray-50/50">
                      <td className="py-3 pr-4 pl-4 font-medium text-text-heading">Notes</td>
                      <td className="py-3 pr-4 text-sm text-text-body">{provider.fees.notes}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Security Details */}
      <section className="py-12">
        <div className="container-main">
          <h2 className="text-2xl font-extrabold tracking-tight">Security Details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-body">
                Key Management
              </p>
              <p className="mt-1 text-lg font-bold text-text-heading">
                {provider.security.keyManagementType}
              </p>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-body">
                Cold Storage
              </p>
              <p className="mt-1 text-lg font-bold text-text-heading">
                {provider.security.coldStoragePercent}
              </p>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-body">
                SOC Compliance
              </p>
              <p className="mt-1 text-lg font-bold text-text-heading">
                {provider.security.socCompliance}
              </p>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-body">
                Penetration Testing
              </p>
              <p className="mt-1 text-lg font-bold text-text-heading">
                {provider.security.penetrationTesting ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          {provider.security.incidentHistory && (
            <p className="mt-4 text-sm text-text-body">
              <strong className="text-text-heading">Incident History:</strong>{' '}
              {provider.security.incidentHistory}
            </p>
          )}
        </div>
      </section>

      {/* Insurance */}
      <section className="bg-bg-light py-12">
        <div className="container-main">
          <h2 className="text-2xl font-extrabold tracking-tight">Insurance Coverage</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-body">
                Coverage
              </p>
              <p className="mt-1 text-lg font-bold text-text-heading">
                {provider.insurance.coverage}
              </p>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-body">
                Carrier
              </p>
              <p className="mt-1 text-lg font-bold text-text-heading">
                {provider.insurance.carrier}
              </p>
            </div>
            <div className="card sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-body">
                Details
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-body">
                {provider.insurance.details}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Status */}
      <section className="py-12">
        <div className="container-main">
          <h2 className="text-2xl font-extrabold tracking-tight">Regulatory Status</h2>
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              {provider.regulatory.qualifiedCustodian && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-score-green/10 px-4 py-1.5 text-sm font-semibold text-score-green">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Qualified Custodian
                </span>
              )}
              <span className="text-sm text-text-body">
                <strong className="text-text-heading">Jurisdiction:</strong>{' '}
                {provider.regulatory.jurisdiction}
              </span>
            </div>
            {provider.regulatory.licenses.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-text-heading">Licenses</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {provider.regulatory.licenses.map((license, i) => (
                    <li
                      key={i}
                      className="rounded-md bg-bg-light px-3 py-1 text-xs font-medium text-text-body"
                    >
                      {license}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {provider.regulatory.details && (
              <p className="mt-4 text-sm leading-relaxed text-text-body">
                {provider.regulatory.details}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="bg-bg-light py-12">
        <div className="container-main">
          <h2 className="text-2xl font-extrabold tracking-tight">Pros &amp; Cons</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Pros */}
            <div className="card">
              <h3 className="text-lg font-bold text-score-green">Pros</h3>
              <ul className="mt-4 space-y-3">
                {provider.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-score-green"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-text-body">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Cons */}
            <div className="card">
              <h3 className="text-lg font-bold text-score-red">Cons</h3>
              <ul className="mt-4 space-y-3">
                {provider.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-score-red"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-sm text-text-body">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Compares */}
      <section className="py-12">
        <div className="container-main">
          <h2 className="text-2xl font-extrabold tracking-tight">How {provider.name} Compares</h2>
          <p className="mt-2 text-sm text-text-body">
            Top {provider.custodyTypeLabel.toLowerCase()} providers ranked by Custody Score.
          </p>
          {alternatives.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="py-3 pr-4 font-semibold text-text-heading">Provider</th>
                    <th className="px-4 py-3 text-center font-semibold text-text-heading">
                      Custody Score
                    </th>
                    <th className="py-3 pl-4 text-right font-semibold text-text-heading">
                      Compare
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alternatives.map((alt, i) => {
                    const slugPair =
                      provider.slug < alt.slug
                        ? `${provider.slug}-vs-${alt.slug}`
                        : `${alt.slug}-vs-${provider.slug}`
                    return (
                      <tr
                        key={alt.slug}
                        className={i % 2 === 0 ? 'bg-bg-light' : 'bg-white'}
                      >
                        <td className="py-3 pr-4">
                          <Link
                            href={`/custodian/${alt.slug}`}
                            className="font-medium text-text-heading hover:text-brand"
                          >
                            {alt.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <CustodyScoreBadge score={alt.custodyScore} size="sm" />
                          </div>
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <Link
                            href={`/compare/${slugPair}/`}
                            className="text-xs font-semibold text-brand hover:underline"
                          >
                            Compare &rarr;
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-6 text-sm text-text-body">
              No other providers in the {provider.custodyTypeLabel.toLowerCase()} category.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero relative overflow-hidden py-16">
        <div className="absolute inset-0 hero-glow" />
        <div className="container-main relative text-center">
          {provider.slug === 'onramp' ? (
            <a
              href={provider.website}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="btn-primary text-lg"
            >
              Get Started with Onramp &rarr;
            </a>
          ) : (
            <Link href={`/compare/onramp-vs-${provider.slug}/`} className="btn-primary text-lg">
              Compare with Onramp &rarr;
            </Link>
          )}
        </div>
      </section>
    </>
  )
}
