'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getProviders, Provider } from '@/lib/providers'
import { calculateCustodyScore, SCORE_CRITERIA, getScoreColor, getScoringWeights } from '@/lib/scoring'
import CustodyScoreBadge from '@/components/CustodyScoreBadge'
import ScoreRadar from '@/components/ScoreRadar'

export default function ComparatorPage() {
  const allProviders = getProviders()
  const [selected, setSelected] = useState<string[]>([])

  function toggleProvider(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug)
      if (prev.length >= 4) return prev
      return [...prev, slug]
    })
  }

  const selectedProviders = useMemo(
    () => selected.map((slug) => allProviders.find((p) => p.slug === slug)!).filter(Boolean),
    [selected, allProviders]
  )

  const weights = getScoringWeights()
  const allFeatures = useMemo(() => {
    const featureSet = new Set<string>()
    selectedProviders.forEach((p) => p.features.forEach((f) => featureSet.add(f)))
    return Array.from(featureSet).sort()
  }, [selectedProviders])

  return (
    <div className="py-12">
      <div className="container-main">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-btc-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/#tools" className="hover:text-btc-orange">Tools</Link>
          <span className="mx-2">/</span>
          <span className="text-text-heading">Head-to-Head Comparator</span>
        </nav>

        <h1 className="text-3xl font-extrabold sm:text-4xl">Head-to-Head Comparator</h1>
        <p className="mt-3 text-text-body">Select 2–4 providers to compare side by side.</p>

        {/* Provider Selection */}
        <div className="mt-8 flex flex-wrap gap-2">
          {allProviders.map((p) => (
            <button
              key={p.slug}
              onClick={() => toggleProvider(p.slug)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                selected.includes(p.slug)
                  ? 'border-btc-orange bg-btc-orange text-white'
                  : 'border-gray-300 bg-white text-text-body hover:border-btc-orange'
              } ${!selected.includes(p.slug) && selected.length >= 4 ? 'cursor-not-allowed opacity-40' : ''}`}
              disabled={!selected.includes(p.slug) && selected.length >= 4}
            >
              {p.name}
            </button>
          ))}
        </div>

        {selected.length < 2 && (
          <p className="mt-6 text-sm text-gray-400">Select at least 2 providers to start comparing.</p>
        )}

        {selected.length >= 2 && (
          <>
            {/* Score Comparison Table */}
            <div className="mt-10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 pr-4 text-left font-semibold">Criterion</th>
                    <th className="px-2 py-3 text-center font-semibold">Weight</th>
                    {selectedProviders.map((p) => (
                      <th key={p.slug} className="px-2 py-3 text-center font-semibold">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SCORE_CRITERIA.map((c, i) => {
                    const key = c.key as keyof typeof weights
                    const values = selectedProviders.map((p) => p.scores[key])
                    const maxVal = Math.max(...values)
                    return (
                      <tr key={c.key} className={i % 2 === 0 ? 'bg-bg-light' : ''}>
                        <td className="py-3 pr-4 font-medium">{c.label}</td>
                        <td className="px-2 py-3 text-center text-gray-500">{(weights[key] * 100).toFixed(0)}%</td>
                        {selectedProviders.map((p) => (
                          <td key={p.slug} className={`px-2 py-3 text-center font-mono font-medium ${p.scores[key] === maxVal ? 'text-score-green' : ''}`}>
                            {p.scores[key].toFixed(1)}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-4 pr-4 font-bold">Custody Score</td>
                    <td className="px-2 py-4 text-center text-gray-500">100%</td>
                    {selectedProviders.map((p) => (
                      <td key={p.slug} className="px-2 py-4">
                        <div className="flex justify-center">
                          <CustodyScoreBadge score={calculateCustodyScore(p.scores)} size="sm" />
                        </div>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Feature Comparison */}
            <h2 className="mt-12 text-xl font-bold">Feature Comparison</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 pr-4 text-left font-semibold">Feature</th>
                    {selectedProviders.map((p) => (
                      <th key={p.slug} className="px-2 py-3 text-center font-semibold">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feat, i) => (
                    <tr key={feat} className={i % 2 === 0 ? 'bg-bg-light' : ''}>
                      <td className="py-2 pr-4 text-xs">{feat}</td>
                      {selectedProviders.map((p) => (
                        <td key={p.slug} className="px-2 py-2 text-center">
                          {p.features.includes(feat) ? (
                            <span className="text-score-green">&#10003;</span>
                          ) : (
                            <span className="text-gray-300">&#10005;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fee Comparison */}
            <h2 className="mt-12 text-xl font-bold">Fee Comparison</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 pr-4 text-left font-semibold">Fee Type</th>
                    {selectedProviders.map((p) => (
                      <th key={p.slug} className="px-2 py-3 text-center font-semibold">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(['setup', 'custodyAnnual', 'transaction', 'withdrawal'] as const).map((feeKey, i) => (
                    <tr key={feeKey} className={i % 2 === 0 ? 'bg-bg-light' : ''}>
                      <td className="py-2 pr-4 font-medium capitalize">{feeKey === 'custodyAnnual' ? 'Annual Custody' : feeKey}</td>
                      {selectedProviders.map((p) => (
                        <td key={p.slug} className="px-2 py-2 text-center font-mono text-xs">{p.fees[feeKey]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Links */}
            <div className="mt-10 flex flex-wrap gap-3">
              {selectedProviders.map((p) => (
                <Link key={p.slug} href={`/custodian/${p.slug}`} className="btn-secondary text-sm">
                  {p.name} Full Review →
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
