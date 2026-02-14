import { MetadataRoute } from 'next'
import { getProviders, getCustodyTypes } from '@/lib/providers'
import { getAllComparisonPairs } from '@/lib/comparisons'

const SITE_URL = 'https://custodycompare.com'

const GUIDE_SLUGS = [
  'what-is-bitcoin-custody',
  'how-to-choose-a-custodian',
  'multi-institution-custody-explained',
  'custody-after-ftx-celsius-lessons',
  'self-custody-vs-third-party',
  'custody-for-family-offices',
  'custody-for-rias-and-advisors',
  'bitcoin-custody-insurance-explained',
  'hardware-wallets-vs-institutional-custody',
  'bitcoin-inheritance-planning',
  'qualified-custodian-requirements',
  'bitcoin-custody-fees-explained',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const providers = getProviders()
  const types = getCustodyTypes()
  const pairs = getAllComparisonPairs()
  const now = new Date().toISOString()

  const entries: MetadataRoute.Sitemap = []

  // Homepage
  entries.push({ url: SITE_URL, lastModified: now, priority: 1.0, changeFrequency: 'weekly' })

  // Category pages
  types.forEach((t) => {
    entries.push({ url: `${SITE_URL}/custody-type/${t.id}`, lastModified: now, priority: 0.9, changeFrequency: 'monthly' })
  })

  // Provider pages
  providers.forEach((p) => {
    entries.push({ url: `${SITE_URL}/custodian/${p.slug}`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' })
  })

  // Tool pages
  ;['fee-calculator', 'risk-score', 'compare', 'decision-tree'].forEach((tool) => {
    entries.push({ url: `${SITE_URL}/tools/${tool}`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' })
  })

  // Guide pages
  GUIDE_SLUGS.forEach((slug) => {
    entries.push({ url: `${SITE_URL}/guides/${slug}`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' })
  })

  // Comparison pages
  pairs.forEach((pair) => {
    entries.push({ url: `${SITE_URL}/compare/${pair.slugs}`, lastModified: now, priority: 0.6, changeFrequency: 'monthly' })
  })

  return entries
}
