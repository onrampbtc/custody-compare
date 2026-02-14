import { Provider, getProviders } from './providers'
import { calculateCustodyScore } from './scoring'

export interface ComparisonPair {
  slugs: string
  providerA: Provider
  providerB: Provider
  scoreA: number
  scoreB: number
}

function getCanonicalOrder(a: Provider, b: Provider): [Provider, Provider] {
  const scoreA = calculateCustodyScore(a.scores)
  const scoreB = calculateCustodyScore(b.scores)
  if (scoreA !== scoreB) {
    return scoreA > scoreB ? [a, b] : [b, a]
  }
  return a.slug < b.slug ? [a, b] : [b, a]
}

export function getAllComparisonPairs(): ComparisonPair[] {
  const providers = getProviders()
  const pairs: ComparisonPair[] = []

  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      const [first, second] = getCanonicalOrder(providers[i], providers[j])
      pairs.push({
        slugs: `${first.slug}-vs-${second.slug}`,
        providerA: first,
        providerB: second,
        scoreA: calculateCustodyScore(first.scores),
        scoreB: calculateCustodyScore(second.scores),
      })
    }
  }

  return pairs
}

export function getComparisonPair(slugs: string): ComparisonPair | undefined {
  return getAllComparisonPairs().find((p) => p.slugs === slugs)
}

export function getCanonicalSlug(slugA: string, slugB: string): string {
  const providers = getProviders()
  const a = providers.find((p) => p.slug === slugA)
  const b = providers.find((p) => p.slug === slugB)
  if (!a || !b) return `${slugA}-vs-${slugB}`
  const [first, second] = getCanonicalOrder(a, b)
  return `${first.slug}-vs-${second.slug}`
}
