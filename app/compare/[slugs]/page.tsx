import { getAllComparisonPairs, getComparisonPair } from '@/lib/comparisons'
import { getProviders, getProvider } from '@/lib/providers'
import {
  calculateCustodyScore,
  SCORE_CRITERIA,
  getHighestCategory,
  getLowestCategory,
} from '@/lib/scoring'
import { getScoringWeights } from '@/lib/scoring'
import { comparisonPageSchema, faqSchema } from '@/lib/seo'
import ComparisonTable from '@/components/ComparisonTable'
import ScoreRadar from '@/components/ScoreRadar'
import CustodyScoreBadge from '@/components/CustodyScoreBadge'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { redirect } from 'next/navigation'

export function generateStaticParams() {
  const pairs = getAllComparisonPairs()
  return pairs.map((pair) => ({ slugs: pair.slugs }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string }>
}): Promise<Metadata> {
  const { slugs } = await params
  const pair = getComparisonPair(slugs)
  if (!pair) return {}

  const { providerA, providerB } = pair
  const title = `${providerA.name} vs ${providerB.name} — Bitcoin Custody Comparison 2026`
  const description = `Compare ${providerA.name} and ${providerB.name} head-to-head across security, insurance, fees, and 5 more custody criteria.`

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
    },
  }
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slugs: string }>
}) {
  const { slugs } = await params

  // Parse slugs and look up canonical pair
  const parts = slugs.split('-vs-')
  if (parts.length !== 2) {
    notFound()
  }
  const [slugA, slugB] = parts

  const pair = getComparisonPair(slugs)

  if (!pair) {
    // Try the reversed order to see if a canonical version exists
    const reversed = `${slugB}-vs-${slugA}`
    const reversedPair = getComparisonPair(reversed)
    if (reversedPair) {
      redirect(`/compare/${reversed}`)
    }
    notFound()
  }

  const { providerA, providerB, scoreA, scoreB } = pair
  const weights = getScoringWeights()

  // Determine winner and category wins
  let winsA = 0
  let winsB = 0
  for (const c of SCORE_CRITERIA) {
    const key = c.key as keyof typeof weights
    if (providerA.scores[key] > providerB.scores[key]) winsA++
    else if (providerB.scores[key] > providerA.scores[key]) winsB++
  }
  const winner = scoreA >= scoreB ? providerA : providerB
  const winnerScore = scoreA >= scoreB ? scoreA : scoreB
  const loserScore = scoreA >= scoreB ? scoreB : scoreA
  const winnerWins = scoreA >= scoreB ? winsA : winsB

  // FAQ data
  const faqs = [
    {
      question: `Is ${providerA.name} or ${providerB.name} better for Bitcoin custody?`,
      answer: `${winner.name} scores ${winnerScore.toFixed(1)} vs ${loserScore.toFixed(1)} in our weighted Custody Score. ${winner.name} leads in ${winnerWins} of 8 scoring categories. However, the best choice depends on your specific needs: ${providerA.name} is best for ${providerA.targetAudience.slice(0, 2).join(' and ')}, while ${providerB.name} suits ${providerB.targetAudience.slice(0, 2).join(' and ')}.`,
    },
    {
      question: `What is the difference between ${providerA.name} and ${providerB.name}?`,
      answer: `${providerA.name} is a ${providerA.custodyTypeLabel.toLowerCase()} provider, while ${providerB.name} is a ${providerB.custodyTypeLabel.toLowerCase()} provider. ${providerA.name} excels in ${getHighestCategory(providerA.scores)}, whereas ${providerB.name} is strongest in ${getHighestCategory(providerB.scores)}.`,
    },
    {
      question: `How do ${providerA.name} and ${providerB.name} fees compare?`,
      answer: `${providerA.name} charges ${providerA.fees.custodyAnnual} annual custody fees with ${providerA.fees.transaction} transaction fees. ${providerB.name} charges ${providerB.fees.custodyAnnual} annual custody fees with ${providerB.fees.transaction} transaction fees.`,
    },
    {
      question: `Which is more secure, ${providerA.name} or ${providerB.name}?`,
      answer: `${providerA.name} scores ${providerA.scores.security.toFixed(1)}/10 for security while ${providerB.name} scores ${providerB.scores.security.toFixed(1)}/10. ${providerA.name} uses ${providerA.security.keyManagementType} key management, and ${providerB.name} uses ${providerB.security.keyManagementType}.`,
    },
  ]

  // Union of features from both providers
  const allFeatures = Array.from(
    new Set([...providerA.features, ...providerB.features])
  ).sort()

  // Other comparison pairs for "Explore More"
  const allPairs = getAllComparisonPairs()
  const otherPairs = allPairs
    .filter((p) => p.slugs !== pair.slugs)
    .slice(0, 3)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(comparisonPageSchema(providerA, providerB)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqs)),
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
              <Link href="/tools/compare" className="hover:text-brand">
                Compare
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              <span className="font-medium text-text-heading">
                {providerA.name} vs {providerB.name}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* H1 Header */}
      <section className="gradient-hero relative overflow-hidden py-14 sm:py-20">
        <div className="hero-glow absolute inset-0" />
        <div className="container-main relative text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {providerA.name} <span className="text-brand">vs</span> {providerB.name} — Head-to-Head Custody
            Comparison
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            An independent, data-driven comparison of{' '}
            {providerA.name} and {providerB.name} across security, insurance,
            fees, regulatory compliance, and more.
          </p>
        </div>
      </section>

      {/* Quick Verdict */}
      <section className="py-12 sm:py-16">
        <div className="container-main">
          <p className="section-label">Verdict</p>
          <div className="card mx-auto max-w-3xl border-t-4 border-brand">
            <h2 className="text-xl font-bold text-text-heading">
              Quick Verdict
            </h2>
            <p className="mt-3 leading-relaxed text-text-body">
              {providerA.name} scores{' '}
              <strong>{scoreA.toFixed(1)}</strong> vs {providerB.name}&apos;s{' '}
              <strong>{scoreB.toFixed(1)}</strong>.{' '}
              {winner.name} leads in {winnerWins} of 8 categories.
            </p>
            <p className="mt-2 leading-relaxed text-text-body">
              <strong>{providerA.name}</strong> is better suited for{' '}
              {providerA.targetAudience.slice(0, 3).join(', ')}.{' '}
              <strong>{providerB.name}</strong> is better suited for{' '}
              {providerB.targetAudience.slice(0, 3).join(', ')}.
            </p>
            <div className="mt-5 flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-1">
                <CustodyScoreBadge score={scoreA} size="lg" showLabel />
                <span className="mt-1 text-sm font-medium text-text-heading">
                  {providerA.name}
                </span>
              </div>
              <span className="text-2xl font-bold text-gray-300">vs</span>
              <div className="flex flex-col items-center gap-1">
                <CustodyScoreBadge score={scoreB} size="lg" showLabel />
                <span className="mt-1 text-sm font-medium text-text-heading">
                  {providerB.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Score Table */}
      <section className="py-12">
        <div className="container-main">
          <p className="section-label">Scores</p>
          <h2 className="section-heading text-center">
            Score Comparison
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-text-body">
            Weighted scores across all 8 custody criteria.
          </p>
          <div className="card mt-8">
            <ComparisonTable providerA={providerA} providerB={providerB} />
          </div>
        </div>
      </section>

      {/* Radar Chart */}
      <section className="bg-bg-light py-12">
        <div className="container-main">
          <p className="section-label">Visual</p>
          <h2 className="section-heading text-center">
            Score Radar
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-text-body">
            Visual overlay of {providerA.name} and {providerB.name} across all
            categories.
          </p>
          <div className="card mx-auto mt-8 max-w-lg">
            <ScoreRadar
              scores={providerA.scores}
              scoresB={providerB.scores}
              nameA={providerA.name}
              nameB={providerB.name}
            />
          </div>
        </div>
      </section>

      {/* Category-by-Category Analysis */}
      <section className="py-12">
        <div className="container-main">
          <p className="section-label">Deep Dive</p>
          <h2 className="section-heading text-center">
            Category-by-Category Analysis
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-text-body">
            A deeper look at how each provider performs in every scoring
            criterion.
          </p>
          <div className="mt-8 space-y-6">
            {/* Security */}
            <div className="card overflow-hidden">
              <div className="border-l-4 border-brand pl-4">
                <h3 className="text-lg font-semibold text-text-heading">
                  Security{' '}
                  <span className="text-sm font-normal text-gray-500">
                    ({providerA.scores.security.toFixed(1)} vs{' '}
                    {providerB.scores.security.toFixed(1)})
                  </span>
                </h3>
              </div>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerA.name} uses {providerA.security.keyManagementType} key
                management with {providerA.security.coldStoragePercent} in cold
                storage and{' '}
                {providerA.security.penetrationTesting
                  ? 'regular penetration testing'
                  : 'no confirmed penetration testing'}
                . Compliance: {providerA.security.socCompliance}. Incident
                history: {providerA.security.incidentHistory}.
              </p>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerB.name} uses {providerB.security.keyManagementType} key
                management with {providerB.security.coldStoragePercent} in cold
                storage and{' '}
                {providerB.security.penetrationTesting
                  ? 'regular penetration testing'
                  : 'no confirmed penetration testing'}
                . Compliance: {providerB.security.socCompliance}. Incident
                history: {providerB.security.incidentHistory}.
              </p>
            </div>

            {/* Insurance */}
            <div className="card overflow-hidden">
              <div className="border-l-4 border-brand pl-4">
                <h3 className="text-lg font-semibold text-text-heading">
                  Insurance{' '}
                  <span className="text-sm font-normal text-gray-500">
                    ({providerA.scores.insurance.toFixed(1)} vs{' '}
                    {providerB.scores.insurance.toFixed(1)})
                  </span>
                </h3>
              </div>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerA.name} offers {providerA.insurance.coverage} via{' '}
                {providerA.insurance.carrier}.{' '}
                {providerA.insurance.details}
              </p>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerB.name} offers {providerB.insurance.coverage} via{' '}
                {providerB.insurance.carrier}.{' '}
                {providerB.insurance.details}
              </p>
            </div>

            {/* Regulatory */}
            <div className="card overflow-hidden">
              <div className="border-l-4 border-brand pl-4">
                <h3 className="text-lg font-semibold text-text-heading">
                  Regulatory{' '}
                  <span className="text-sm font-normal text-gray-500">
                    ({providerA.scores.regulatory.toFixed(1)} vs{' '}
                    {providerB.scores.regulatory.toFixed(1)})
                  </span>
                </h3>
              </div>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerA.name} holds{' '}
                {providerA.regulatory.licenses.join(', ')} and is
                {providerA.regulatory.qualifiedCustodian
                  ? ' a qualified custodian'
                  : ' not a qualified custodian'}{' '}
                operating in {providerA.regulatory.jurisdiction}.{' '}
                {providerA.regulatory.details}
              </p>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerB.name} holds{' '}
                {providerB.regulatory.licenses.join(', ')} and is
                {providerB.regulatory.qualifiedCustodian
                  ? ' a qualified custodian'
                  : ' not a qualified custodian'}{' '}
                operating in {providerB.regulatory.jurisdiction}.{' '}
                {providerB.regulatory.details}
              </p>
            </div>

            {/* Fee Transparency */}
            <div className="card overflow-hidden">
              <div className="border-l-4 border-brand pl-4">
                <h3 className="text-lg font-semibold text-text-heading">
                  Fee Transparency{' '}
                  <span className="text-sm font-normal text-gray-500">
                    ({providerA.scores.feeTransparency.toFixed(1)} vs{' '}
                    {providerB.scores.feeTransparency.toFixed(1)})
                  </span>
                </h3>
              </div>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerA.name} charges {providerA.fees.custodyAnnual} in
                annual custody fees with {providerA.fees.transaction} per
                transaction. {providerA.fees.notes}
              </p>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerB.name} charges {providerB.fees.custodyAnnual} in
                annual custody fees with {providerB.fees.transaction} per
                transaction. {providerB.fees.notes}
              </p>
            </div>

            {/* Track Record */}
            <div className="card overflow-hidden">
              <div className="border-l-4 border-brand pl-4">
                <h3 className="text-lg font-semibold text-text-heading">
                  Track Record{' '}
                  <span className="text-sm font-normal text-gray-500">
                    ({providerA.scores.trackRecord.toFixed(1)} vs{' '}
                    {providerB.scores.trackRecord.toFixed(1)})
                  </span>
                </h3>
              </div>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerA.name} was founded in {providerA.founded} and is
                headquartered in {providerA.headquarters}. AUM:{' '}
                {providerA.aum}. Incident history:{' '}
                {providerA.security.incidentHistory}.
              </p>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerB.name} was founded in {providerB.founded} and is
                headquartered in {providerB.headquarters}. AUM:{' '}
                {providerB.aum}. Incident history:{' '}
                {providerB.security.incidentHistory}.
              </p>
            </div>

            {/* Withdrawal Flexibility */}
            <div className="card overflow-hidden">
              <div className="border-l-4 border-brand pl-4">
                <h3 className="text-lg font-semibold text-text-heading">
                  Withdrawal Flexibility{' '}
                  <span className="text-sm font-normal text-gray-500">
                    ({providerA.scores.withdrawalFlexibility.toFixed(1)} vs{' '}
                    {providerB.scores.withdrawalFlexibility.toFixed(1)})
                  </span>
                </h3>
              </div>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerA.name} withdrawal fees: {providerA.fees.withdrawal}.
                Minimum account: {providerA.minAccount}. Supported assets:{' '}
                {providerA.supportedAssets.join(', ')}.
              </p>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerB.name} withdrawal fees: {providerB.fees.withdrawal}.
                Minimum account: {providerB.minAccount}. Supported assets:{' '}
                {providerB.supportedAssets.join(', ')}.
              </p>
            </div>

            {/* Reporting & Audit */}
            <div className="card overflow-hidden">
              <div className="border-l-4 border-brand pl-4">
                <h3 className="text-lg font-semibold text-text-heading">
                  Reporting &amp; Audit{' '}
                  <span className="text-sm font-normal text-gray-500">
                    ({providerA.scores.reportingAudit.toFixed(1)} vs{' '}
                    {providerB.scores.reportingAudit.toFixed(1)})
                  </span>
                </h3>
              </div>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerA.name}: SOC compliance is{' '}
                {providerA.security.socCompliance}.{' '}
                {providerA.regulatory.qualifiedCustodian
                  ? 'As a qualified custodian, it meets SEC reporting requirements.'
                  : 'Not classified as a qualified custodian.'}
              </p>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerB.name}: SOC compliance is{' '}
                {providerB.security.socCompliance}.{' '}
                {providerB.regulatory.qualifiedCustodian
                  ? 'As a qualified custodian, it meets SEC reporting requirements.'
                  : 'Not classified as a qualified custodian.'}
              </p>
            </div>

            {/* Counterparty Diversification */}
            <div className="card overflow-hidden">
              <div className="border-l-4 border-brand pl-4">
                <h3 className="text-lg font-semibold text-text-heading">
                  Counterparty Diversification{' '}
                  <span className="text-sm font-normal text-gray-500">
                    (
                    {providerA.scores.counterpartyDiversification.toFixed(1)} vs{' '}
                    {providerB.scores.counterpartyDiversification.toFixed(1)})
                  </span>
                </h3>
              </div>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerA.name} is a {providerA.custodyTypeLabel.toLowerCase()}{' '}
                provider. Key management: {providerA.keyManagement}.
              </p>
              <p className="mt-2 leading-relaxed text-text-body">
                {providerB.name} is a {providerB.custodyTypeLabel.toLowerCase()}{' '}
                provider. Key management: {providerB.keyManagement}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Comparison */}
      <section className="bg-bg-light py-12">
        <div className="container-main">
          <p className="section-label">Fees</p>
          <h2 className="section-heading text-center">
            Fee Comparison
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-text-body">
            Side-by-side fee breakdown for {providerA.name} and{' '}
            {providerB.name}.
          </p>
          <div className="card mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 pr-4 text-left font-semibold text-text-heading">
                    Fee Type
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-text-heading">
                    {providerA.name}
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-text-heading">
                    {providerB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-bg-light">
                  <td className="py-3 pr-4 font-medium text-text-body">
                    Setup Fee
                  </td>
                  <td className="px-4 py-3 text-center text-text-body">
                    {providerA.fees.setup}
                  </td>
                  <td className="px-4 py-3 text-center text-text-body">
                    {providerB.fees.setup}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-text-body">
                    Annual Custody
                  </td>
                  <td className="px-4 py-3 text-center text-text-body">
                    {providerA.fees.custodyAnnual}
                  </td>
                  <td className="px-4 py-3 text-center text-text-body">
                    {providerB.fees.custodyAnnual}
                  </td>
                </tr>
                <tr className="bg-bg-light">
                  <td className="py-3 pr-4 font-medium text-text-body">
                    Transaction
                  </td>
                  <td className="px-4 py-3 text-center text-text-body">
                    {providerA.fees.transaction}
                  </td>
                  <td className="px-4 py-3 text-center text-text-body">
                    {providerB.fees.transaction}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-text-body">
                    Withdrawal
                  </td>
                  <td className="px-4 py-3 text-center text-text-body">
                    {providerA.fees.withdrawal}
                  </td>
                  <td className="px-4 py-3 text-center text-text-body">
                    {providerB.fees.withdrawal}
                  </td>
                </tr>
              </tbody>
            </table>
            {(providerA.fees.notes || providerB.fees.notes) && (
              <div className="mt-4 space-y-1 text-xs text-gray-500">
                {providerA.fees.notes && (
                  <p>
                    <strong>{providerA.name}:</strong> {providerA.fees.notes}
                  </p>
                )}
                {providerB.fees.notes && (
                  <p>
                    <strong>{providerB.name}:</strong> {providerB.fees.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-12">
        <div className="container-main">
          <p className="section-label">Features</p>
          <h2 className="section-heading text-center">
            Feature Comparison
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-text-body">
            Checklist of features across both providers.
          </p>
          <div className="card mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 pr-4 text-left font-semibold text-text-heading">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-text-heading">
                    {providerA.name}
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-text-heading">
                    {providerB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, i) => {
                  const hasA = providerA.features.includes(feature)
                  const hasB = providerB.features.includes(feature)
                  return (
                    <tr
                      key={feature}
                      className={i % 2 === 0 ? 'bg-bg-light' : ''}
                    >
                      <td className="py-3 pr-4 text-text-body">{feature}</td>
                      <td className="px-4 py-3 text-center">
                        {hasA ? (
                          <span
                            className="text-score-green"
                            aria-label="Yes"
                          >
                            &#10003;
                          </span>
                        ) : (
                          <span
                            className="text-score-red"
                            aria-label="No"
                          >
                            &#10007;
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {hasB ? (
                          <span
                            className="text-score-green"
                            aria-label="Yes"
                          >
                            &#10003;
                          </span>
                        ) : (
                          <span
                            className="text-score-red"
                            aria-label="No"
                          >
                            &#10007;
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Who Should Choose Which */}
      <section className="bg-bg-light py-12">
        <div className="container-main">
          <p className="section-label">Recommendation</p>
          <h2 className="section-heading text-center">
            Who Should Choose Which?
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Provider A box */}
            <div className="card border-l-4 border-brand bg-gradient-to-br from-brand/5 to-brand-light/30">
              <h3 className="text-lg font-bold text-text-heading">
                {providerA.name} is better if you&hellip;
              </h3>
              <ul className="mt-3 space-y-2">
                {providerA.targetAudience.map((audience) => (
                  <li
                    key={audience}
                    className="flex items-start gap-2 text-text-body"
                  >
                    <span className="mt-0.5 text-brand">&#10003;</span>
                    <span>Are a {audience.toLowerCase()}</span>
                  </li>
                ))}
                {providerA.pros.slice(0, 3).map((pro) => (
                  <li
                    key={pro}
                    className="flex items-start gap-2 text-text-body"
                  >
                    <span className="mt-0.5 text-brand">&#10003;</span>
                    <span>Want: {pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Provider B box */}
            <div className="card border-l-4 border-score-blue bg-gradient-to-br from-blue-50/50 to-sky-50/30">
              <h3 className="text-lg font-bold text-text-heading">
                {providerB.name} is better if you&hellip;
              </h3>
              <ul className="mt-3 space-y-2">
                {providerB.targetAudience.map((audience) => (
                  <li
                    key={audience}
                    className="flex items-start gap-2 text-text-body"
                  >
                    <span className="mt-0.5 text-score-blue">&#10003;</span>
                    <span>Are a {audience.toLowerCase()}</span>
                  </li>
                ))}
                {providerB.pros.slice(0, 3).map((pro) => (
                  <li
                    key={pro}
                    className="flex items-start gap-2 text-text-body"
                  >
                    <span className="mt-0.5 text-score-blue">&#10003;</span>
                    <span>Want: {pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container-main">
          <p className="section-label">FAQ</p>
          <h2 className="section-heading text-center">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="card border-l-4 border-gray-200 hover:border-brand transition-colors">
                <h3 className="font-semibold text-text-heading">
                  {faq.question}
                </h3>
                <p className="mt-2 leading-relaxed text-text-body">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-16 sm:py-20">
        <div className="container-main">
          <p className="section-label">Related</p>
          <h2 className="section-heading text-center">
            Explore More
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Full review links */}
            <Link
              href={`/custodian/${providerA.slug}`}
              className="card group"
            >
              <h3 className="font-semibold text-text-heading group-hover:text-brand">
                {providerA.name} Full Review
              </h3>
              <p className="mt-1 text-sm text-text-body">
                Deep dive into {providerA.name}&apos;s custody solution,
                scoring methodology, and detailed analysis.
              </p>
              <p className="mt-3 flex items-center gap-1 text-xs font-medium text-brand">
                Read review
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </p>
            </Link>
            <Link
              href={`/custodian/${providerB.slug}`}
              className="card group"
            >
              <h3 className="font-semibold text-text-heading group-hover:text-brand">
                {providerB.name} Full Review
              </h3>
              <p className="mt-1 text-sm text-text-body">
                Deep dive into {providerB.name}&apos;s custody solution,
                scoring methodology, and detailed analysis.
              </p>
              <p className="mt-3 flex items-center gap-1 text-xs font-medium text-brand">
                Read review
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </p>
            </Link>

            {/* Other comparison pages */}
            {otherPairs.map((op) => (
              <Link
                key={op.slugs}
                href={`/compare/${op.slugs}`}
                className="card group"
              >
                <h3 className="font-semibold text-text-heading group-hover:text-brand">
                  {op.providerA.name} vs {op.providerB.name}
                </h3>
                <p className="mt-1 text-sm text-text-body">
                  Compare {op.providerA.name} ({op.scoreA.toFixed(1)}) and{' '}
                  {op.providerB.name} ({op.scoreB.toFixed(1)}) head-to-head.
                </p>
                <p className="mt-3 flex items-center gap-1 text-xs font-medium text-brand">
                  View comparison
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
