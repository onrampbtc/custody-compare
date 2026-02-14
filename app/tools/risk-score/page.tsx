'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getProviders, getProvidersByType } from '@/lib/providers'
import { rankProviders, calculateCustodyScore } from '@/lib/scoring'
import CustodyScoreBadge from '@/components/CustodyScoreBadge'
import EmailCapture from '@/components/EmailCapture'

interface Question {
  id: string
  text: string
  options: { label: string; value: string }[]
}

const QUESTIONS: Question[] = [
  {
    id: 'amount',
    text: 'How much Bitcoin are you storing?',
    options: [
      { label: 'Under $50K', value: 'small' },
      { label: '$50K – $500K', value: 'medium' },
      { label: '$500K – $5M', value: 'large' },
      { label: 'Over $5M', value: 'institutional' },
    ],
  },
  {
    id: 'technical',
    text: 'How technically comfortable are you with hardware wallets?',
    options: [
      { label: 'Very comfortable', value: 'high' },
      { label: 'Somewhat comfortable', value: 'medium' },
      { label: 'Not at all', value: 'low' },
    ],
  },
  {
    id: 'decentralization',
    text: 'How important is it that no single company controls your Bitcoin?',
    options: [
      { label: 'Critical', value: 'critical' },
      { label: 'Important', value: 'important' },
      { label: 'Not a priority', value: 'low' },
    ],
  },
  {
    id: 'regulation',
    text: 'Do you need your custodian to be a regulated qualified custodian?',
    options: [
      { label: 'Yes, required', value: 'required' },
      { label: 'Preferred', value: 'preferred' },
      { label: "Don't care", value: 'none' },
    ],
  },
  {
    id: 'frequency',
    text: 'How often do you need to access or move your Bitcoin?',
    options: [
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' },
      { label: 'Rarely', value: 'rarely' },
    ],
  },
]

function getRecommendation(answers: Record<string, string>): { type: string; typeName: string; rationale: string } {
  const { amount, technical, decentralization, regulation, frequency } = answers

  if (decentralization === 'critical' && (amount === 'large' || amount === 'institutional')) {
    return { type: 'multi-institution', typeName: 'Multi-Institution Custody', rationale: 'Your high-value holdings and focus on eliminating single points of failure make multi-institution custody the ideal choice.' }
  }

  if (technical === 'high' && decentralization === 'critical') {
    return { type: 'self-custody', typeName: 'Self-Custody / Multisig', rationale: 'Your technical expertise and desire for full control point to self-custody with a multisig setup.' }
  }

  if (technical === 'high' && (amount === 'medium' || amount === 'large')) {
    return { type: 'collaborative-custody', typeName: 'Collaborative Custody', rationale: 'You have the technical skills to hold your own keys but want a professional safety net for recovery and inheritance.' }
  }

  if (regulation === 'required' || amount === 'institutional') {
    return { type: 'qualified-custodian', typeName: 'Qualified Custodian', rationale: 'Your regulatory requirements or institutional-scale holdings need a qualified custodian.' }
  }

  if (frequency === 'rarely' && technical !== 'low') {
    return { type: 'cold-storage', typeName: 'Cold Storage / Hardware', rationale: 'For long-term holding with infrequent access, cold storage provides maximum security at minimum cost.' }
  }

  if (amount === 'small' && frequency === 'daily') {
    return { type: 'exchange-custody', typeName: 'Exchange Custody', rationale: 'For smaller amounts with frequent trading needs, exchange custody is the most practical starting point.' }
  }

  if (decentralization === 'important' && amount === 'medium') {
    return { type: 'collaborative-custody', typeName: 'Collaborative Custody', rationale: 'Collaborative custody gives you control of your keys with professional backup — a good balance for your needs.' }
  }

  return { type: 'qualified-custodian', typeName: 'Qualified Custodian', rationale: 'Based on your profile, a qualified custodian offers the best balance of security, compliance, and ease of use.' }
}

export default function RiskScorePage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  function handleAnswer(questionId: string, value: string) {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setShowResults(true)
    }
  }

  if (showResults) {
    const rec = getRecommendation(answers)
    const typeProviders = getProvidersByType(rec.type)
    const top3 = rankProviders(typeProviders).slice(0, 3)

    return (
      <div className="py-12">
        <div className="container-main max-w-2xl">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-btc-orange">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/#tools" className="hover:text-btc-orange">Tools</Link>
            <span className="mx-2">/</span>
            <span className="text-text-heading">Risk Quiz Results</span>
          </nav>

          <h1 className="text-3xl font-extrabold">Your Custody Recommendation</h1>

          <div className="mt-8 rounded-xl border-2 border-btc-orange bg-btc-orange/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-btc-orange">Recommended Custody Type</p>
            <h2 className="mt-1 text-2xl font-bold text-text-heading">{rec.typeName}</h2>
            <p className="mt-3 text-text-body">{rec.rationale}</p>
            <Link href={`/custody-type/${rec.type}`} className="mt-4 inline-block text-sm font-medium text-btc-orange hover:underline">
              Learn more about {rec.typeName} →
            </Link>
          </div>

          {top3.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold">Top {rec.typeName} Providers</h3>
              <div className="mt-4 space-y-3">
                {top3.map((p) => (
                  <Link key={p.id} href={`/custodian/${p.slug}`} className="card flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-text-heading">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.description.slice(0, 100)}...</p>
                    </div>
                    <CustodyScoreBadge score={p.custodyScore} size="sm" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <EmailCapture />
          </div>

          <button
            onClick={() => { setStep(0); setAnswers({}); setShowResults(false) }}
            className="mt-6 text-sm font-medium text-btc-orange hover:underline"
          >
            ← Retake quiz
          </button>
        </div>
      </div>
    )
  }

  const question = QUESTIONS[step]

  return (
    <div className="py-12">
      <div className="container-main max-w-2xl">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-btc-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/#tools" className="hover:text-btc-orange">Tools</Link>
          <span className="mx-2">/</span>
          <span className="text-text-heading">Custody Risk Quiz</span>
        </nav>

        <h1 className="text-3xl font-extrabold">Find Your Ideal Custody Setup</h1>
        <p className="mt-2 text-text-body">Answer 5 questions to get a personalized custody recommendation.</p>

        {/* Progress */}
        <div className="mt-8 flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-btc-orange' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500">Question {step + 1} of {QUESTIONS.length}</p>
          <h2 className="mt-2 text-xl font-bold">{question.text}</h2>
          <div className="mt-6 space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(question.id, opt.value)}
                className="w-full rounded-lg border-2 border-gray-200 px-6 py-4 text-left font-medium transition-colors hover:border-btc-orange hover:bg-btc-orange/5"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 text-sm font-medium text-gray-500 hover:text-text-heading"
          >
            ← Previous question
          </button>
        )}
      </div>
    </div>
  )
}
