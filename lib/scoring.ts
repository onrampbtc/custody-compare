import { CustodyScores, Provider, getScoringWeights } from './providers'

export { getScoringWeights }

const SCORE_CRITERIA = [
  { key: 'security', label: 'Security' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'regulatory', label: 'Regulatory' },
  { key: 'feeTransparency', label: 'Fee Transparency' },
  { key: 'trackRecord', label: 'Track Record' },
  { key: 'withdrawalFlexibility', label: 'Withdrawal Flexibility' },
  { key: 'reportingAudit', label: 'Reporting & Audit' },
  { key: 'counterpartyDiversification', label: 'Counterparty Diversification' },
] as const

export { SCORE_CRITERIA }

export function calculateCustodyScore(scores: CustodyScores): number {
  const weights = getScoringWeights()
  const weighted = (Object.keys(weights) as (keyof CustodyScores)[]).reduce(
    (sum, key) => sum + scores[key] * weights[key],
    0
  )
  return Math.round(weighted * 10) / 10
}

export function getScoreColor(score: number): string {
  if (score >= 9.0) return '#059669'
  if (score >= 8.0) return '#0284C7'
  if (score >= 7.0) return '#D97706'
  if (score >= 6.0) return '#EA580C'
  return '#DC2626'
}

export function getScoreLabel(score: number): string {
  if (score >= 9.0) return 'Excellent'
  if (score >= 8.0) return 'Very Good'
  if (score >= 7.0) return 'Good'
  if (score >= 6.0) return 'Fair'
  return 'Below Average'
}

export function getScoreColorClass(score: number): string {
  if (score >= 9.0) return 'bg-score-green text-white'
  if (score >= 8.0) return 'bg-score-blue text-white'
  if (score >= 7.0) return 'bg-score-yellow text-black'
  if (score >= 6.0) return 'bg-score-orange text-white'
  return 'bg-score-red text-white'
}

export function getHighestCategory(scores: CustodyScores): string {
  let max = 0
  let maxKey = ''
  for (const c of SCORE_CRITERIA) {
    if (scores[c.key] > max) {
      max = scores[c.key]
      maxKey = c.label
    }
  }
  return maxKey
}

export function getLowestCategory(scores: CustodyScores): string {
  let min = 11
  let minKey = ''
  for (const c of SCORE_CRITERIA) {
    if (scores[c.key] < min) {
      min = scores[c.key]
      minKey = c.label
    }
  }
  return minKey
}

export function rankProviders(providers: Provider[]): (Provider & { custodyScore: number; rank: number })[] {
  const scored = providers.map((p) => ({
    ...p,
    custodyScore: calculateCustodyScore(p.scores),
  }))
  scored.sort((a, b) => b.custodyScore - a.custodyScore)
  return scored.map((p, i) => ({ ...p, rank: i + 1 }))
}
