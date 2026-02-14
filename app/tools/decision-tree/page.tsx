'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getProvidersByType } from '@/lib/providers'
import { rankProviders } from '@/lib/scoring'
import CustodyScoreBadge from '@/components/CustodyScoreBadge'

interface TreeNode {
  id: string
  question: string
  options: { label: string; nextId: string }[]
}

interface ResultNode {
  id: string
  custodyType: string
  typeName: string
  reason: string
}

const TREE_NODES: TreeNode[] = [
  {
    id: 'start',
    question: 'What kind of Bitcoin holder are you?',
    options: [
      { label: 'Individual investor', nextId: 'individual-amount' },
      { label: 'Family office or HNW individual', nextId: 'family-control' },
      { label: 'Institution, fund, or RIA', nextId: 'institution-reg' },
    ],
  },
  {
    id: 'individual-amount',
    question: 'How much Bitcoin do you hold?',
    options: [
      { label: 'Under $50K', nextId: 'small-tech' },
      { label: '$50K – $500K', nextId: 'medium-control' },
      { label: 'Over $500K', nextId: 'family-control' },
    ],
  },
  {
    id: 'small-tech',
    question: 'Are you comfortable managing hardware wallets?',
    options: [
      { label: 'Yes, I prefer full control', nextId: 'result-cold-storage' },
      { label: 'Somewhat — I want a safety net', nextId: 'result-collaborative' },
      { label: 'No, I want simplicity', nextId: 'result-exchange' },
    ],
  },
  {
    id: 'medium-control',
    question: 'How important is maintaining personal control over your keys?',
    options: [
      { label: 'Critical — I hold my own keys', nextId: 'result-self-custody' },
      { label: 'Important — but I want backup help', nextId: 'result-collaborative' },
      { label: 'Not important — security and compliance matter more', nextId: 'result-qualified' },
    ],
  },
  {
    id: 'family-control',
    question: 'What matters most to you?',
    options: [
      { label: 'Eliminating single points of failure', nextId: 'result-multi-institution' },
      { label: 'Holding my own keys with professional support', nextId: 'result-collaborative' },
      { label: 'Maximum regulatory compliance', nextId: 'result-qualified' },
    ],
  },
  {
    id: 'institution-reg',
    question: 'Do you need a qualified custodian for regulatory compliance?',
    options: [
      { label: 'Yes, it is required', nextId: 'institution-risk' },
      { label: 'No, we have flexibility', nextId: 'family-control' },
    ],
  },
  {
    id: 'institution-risk',
    question: 'Is eliminating single-custodian risk a priority?',
    options: [
      { label: 'Yes — we want multi-custodian diversification', nextId: 'result-multi-institution' },
      { label: 'No — a strong single custodian is fine', nextId: 'result-qualified' },
    ],
  },
]

const RESULTS: ResultNode[] = [
  { id: 'result-multi-institution', custodyType: 'multi-institution', typeName: 'Multi-Institution Custody', reason: 'Distributes your Bitcoin across multiple independent custodians so no single entity can compromise your holdings.' },
  { id: 'result-self-custody', custodyType: 'self-custody', typeName: 'Self-Custody / Multisig', reason: 'You hold all the keys. Maximum sovereignty for technically capable holders.' },
  { id: 'result-exchange', custodyType: 'exchange-custody', typeName: 'Exchange Custody', reason: 'Simplest option for smaller amounts. Consider moving to self-custody or collaborative custody as holdings grow.' },
  { id: 'result-qualified', custodyType: 'qualified-custodian', typeName: 'Qualified Custodian', reason: 'Regulated institutional custody with insurance, compliance, and audit trails.' },
  { id: 'result-cold-storage', custodyType: 'cold-storage', typeName: 'Cold Storage / Hardware', reason: 'Air-gapped security for long-term holdings. Low cost, maximum physical security.' },
  { id: 'result-collaborative', custodyType: 'collaborative-custody', typeName: 'Collaborative Custody', reason: 'You hold the majority of keys while a trusted provider holds a backup key for recovery and inheritance.' },
]

export default function DecisionTreePage() {
  const [history, setHistory] = useState<string[]>(['start'])
  const currentId = history[history.length - 1]

  const treeNode = TREE_NODES.find((n) => n.id === currentId)
  const resultNode = RESULTS.find((r) => r.id === currentId)

  function handleChoice(nextId: string) {
    setHistory([...history, nextId])
  }

  function goBack() {
    if (history.length > 1) {
      setHistory(history.slice(0, -1))
    }
  }

  function restart() {
    setHistory(['start'])
  }

  if (resultNode) {
    const typeProviders = getProvidersByType(resultNode.custodyType)
    const top3 = rankProviders(typeProviders).slice(0, 3)

    return (
      <div className="py-12">
        <div className="container-main max-w-2xl">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-btc-orange">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/#tools" className="hover:text-btc-orange">Tools</Link>
            <span className="mx-2">/</span>
            <span className="text-text-heading">Decision Tree</span>
          </nav>

          <h1 className="text-3xl font-extrabold">Your Recommendation</h1>

          <div className="mt-8 rounded-xl border-2 border-score-green bg-score-green/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-score-green">Best Fit</p>
            <h2 className="mt-1 text-2xl font-bold text-text-heading">{resultNode.typeName}</h2>
            <p className="mt-3 text-text-body">{resultNode.reason}</p>
            <Link href={`/custody-type/${resultNode.custodyType}`} className="mt-4 inline-block text-sm font-medium text-btc-orange hover:underline">
              Learn more →
            </Link>
          </div>

          {top3.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold">Top Providers</h3>
              <div className="mt-4 space-y-3">
                {top3.map((p) => (
                  <Link key={p.id} href={`/custodian/${p.slug}`} className="card flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-text-heading">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.custodyTypeLabel}</p>
                    </div>
                    <CustodyScoreBadge score={p.custodyScore} size="sm" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <button onClick={restart} className="mt-8 text-sm font-medium text-btc-orange hover:underline">
            ← Start over
          </button>
        </div>
      </div>
    )
  }

  if (!treeNode) return null

  return (
    <div className="py-12">
      <div className="container-main max-w-2xl">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-btc-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/#tools" className="hover:text-btc-orange">Tools</Link>
          <span className="mx-2">/</span>
          <span className="text-text-heading">Decision Tree</span>
        </nav>

        <h1 className="text-3xl font-extrabold">Bitcoin Custody Decision Tree</h1>
        <p className="mt-2 text-text-body">Follow the guided questions to find your ideal custody solution.</p>

        {/* Progress dots */}
        <div className="mt-6 flex gap-1.5">
          {history.map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-btc-orange" />
          ))}
          <div className="h-2 w-2 rounded-full bg-gray-200" />
        </div>

        <div className="mt-8 rounded-xl bg-bg-light p-8">
          <h2 className="text-xl font-bold text-text-heading">{treeNode.question}</h2>
          <div className="mt-6 space-y-3">
            {treeNode.options.map((opt) => (
              <button
                key={opt.nextId}
                onClick={() => handleChoice(opt.nextId)}
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-6 py-4 text-left font-medium transition-all hover:border-btc-orange hover:shadow-sm"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {history.length > 1 && (
          <button onClick={goBack} className="mt-6 text-sm font-medium text-gray-500 hover:text-text-heading">
            ← Previous question
          </button>
        )}
      </div>
    </div>
  )
}
