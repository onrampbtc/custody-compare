'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getProviders, Provider } from '@/lib/providers'
import { calculateCustodyScore } from '@/lib/scoring'
import CustodyScoreBadge from '@/components/CustodyScoreBadge'

function parseFeePercent(feeStr: string): number | null {
  const match = feeStr.match(/([\d.]+)%/)
  if (match) return parseFloat(match[1]) / 100
  return null
}

function parseFeeFlat(feeStr: string): number | null {
  const match = feeStr.match(/\$([\d,]+)/)
  if (match) return parseFloat(match[1].replace(/,/g, ''))
  return null
}

function estimateAnnualCost(provider: Provider, aum: number): { annual: string; setup: string; total: string; isEstimate: boolean } {
  const annualRate = parseFeePercent(provider.fees.custodyAnnual)
  const setupFlat = parseFeeFlat(provider.fees.setup)

  if (annualRate !== null) {
    const annual = aum * annualRate
    const setup = setupFlat || 0
    return {
      annual: `$${annual.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      setup: setup > 0 ? `$${setup.toLocaleString('en-US')}` : 'Free',
      total: `$${(annual + setup).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      isEstimate: false,
    }
  }

  // Fixed annual fee (e.g., $250/year)
  const annualFlat = parseFeeFlat(provider.fees.custodyAnnual)
  if (annualFlat !== null) {
    const setup = setupFlat || 0
    return {
      annual: `$${annualFlat.toLocaleString('en-US')}`,
      setup: setup > 0 ? `$${setup.toLocaleString('en-US')}` : provider.fees.setup,
      total: `$${(annualFlat + setup).toLocaleString('en-US')}`,
      isEstimate: false,
    }
  }

  // Monthly fee
  const monthlyMatch = provider.fees.custodyAnnual.match(/\$([\d,]+)\/month/)
  if (monthlyMatch) {
    const monthly = parseFloat(monthlyMatch[1].replace(/,/g, ''))
    const annual = monthly * 12
    const setup = setupFlat || 0
    return {
      annual: `$${annual.toLocaleString('en-US')}`,
      setup: setup > 0 ? `$${setup.toLocaleString('en-US')}` : provider.fees.setup,
      total: `$${(annual + setup).toLocaleString('en-US')}`,
      isEstimate: true,
    }
  }

  return {
    annual: 'Contact for pricing',
    setup: provider.fees.setup,
    total: 'Contact for pricing',
    isEstimate: false,
  }
}

const AUM_PRESETS = [
  { label: '$50K', value: 50000 },
  { label: '$250K', value: 250000 },
  { label: '$1M', value: 1000000 },
  { label: '$10M', value: 10000000 },
  { label: '$50M', value: 50000000 },
]

export default function FeeCalculatorPage() {
  const [aum, setAum] = useState(1000000)
  const providers = getProviders()

  const results = useMemo(() => {
    return providers
      .map((p) => ({
        provider: p,
        score: calculateCustodyScore(p.scores),
        costs: estimateAnnualCost(p, aum),
      }))
      .sort((a, b) => {
        const aContact = a.costs.total.includes('Contact')
        const bContact = b.costs.total.includes('Contact')
        if (aContact && !bContact) return 1
        if (!aContact && bContact) return -1
        if (aContact && bContact) return 0
        const aVal = parseFeeFlat(a.costs.total) || 0
        const bVal = parseFeeFlat(b.costs.total) || 0
        return aVal - bVal
      })
  }, [aum, providers])

  return (
    <div className="py-12">
      <div className="container-main">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-btc-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/#tools" className="hover:text-btc-orange">Tools</Link>
          <span className="mx-2">/</span>
          <span className="text-text-heading">Fee Calculator</span>
        </nav>

        <h1 className="text-3xl font-extrabold sm:text-4xl">Bitcoin Custody Fee Calculator</h1>
        <p className="mt-3 max-w-2xl text-text-body">
          Enter your assets under management to compare annual custody costs across every provider.
          Transparent pricing is itself a signal — note which providers require you to &quot;contact sales.&quot;
        </p>

        {/* AUM Input */}
        <div className="mt-8 rounded-xl bg-bg-light p-6">
          <label className="block text-sm font-semibold text-text-heading">Your AUM (Assets Under Management)</label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {AUM_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setAum(preset.value)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  aum === preset.value
                    ? 'border-btc-orange bg-btc-orange text-white'
                    : 'border-gray-300 bg-white text-text-body hover:border-btc-orange'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={10000}
            max={100000000}
            step={10000}
            value={aum}
            onChange={(e) => setAum(Number(e.target.value))}
            className="mt-4 w-full accent-btc-orange"
          />
          <div className="mt-2 text-center font-mono text-2xl font-bold text-text-heading">
            ${aum.toLocaleString('en-US')}
          </div>
        </div>

        {/* Results Table */}
        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 text-left">
                <th className="py-3 pr-2 font-semibold">Provider</th>
                <th className="px-2 py-3 font-semibold">Custody Type</th>
                <th className="px-2 py-3 text-right font-semibold">Annual Fee</th>
                <th className="px-2 py-3 text-right font-semibold">Setup Fee</th>
                <th className="px-2 py-3 text-right font-semibold">Year 1 Total</th>
                <th className="px-2 py-3 text-center font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr
                  key={r.provider.id}
                  className={`${i % 2 === 0 ? 'bg-bg-light' : ''} ${r.provider.slug === 'onramp' ? 'ring-2 ring-btc-orange ring-inset' : ''}`}
                >
                  <td className="py-3 pr-2">
                    <Link href={`/custodian/${r.provider.slug}`} className="font-medium text-text-heading hover:text-btc-orange">
                      {r.provider.name}
                      {r.provider.slug === 'onramp' && <span className="ml-2 rounded bg-btc-orange/10 px-1.5 py-0.5 text-[10px] font-semibold text-btc-orange">FEATURED</span>}
                    </Link>
                  </td>
                  <td className="px-2 py-3 text-xs text-gray-500">{r.provider.custodyTypeLabel}</td>
                  <td className="px-2 py-3 text-right font-mono">{r.costs.annual}{r.costs.isEstimate ? '*' : ''}</td>
                  <td className="px-2 py-3 text-right font-mono">{r.costs.setup}</td>
                  <td className="px-2 py-3 text-right font-mono font-semibold">{r.costs.total}</td>
                  <td className="px-2 py-3">
                    <div className="flex justify-center">
                      <CustodyScoreBadge score={r.score} size="sm" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-400">* Estimated from monthly pricing. Actual costs may vary. Contact providers directly for exact quotes.</p>
      </div>
    </div>
  )
}
