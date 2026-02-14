import { Provider } from './providers'
import { calculateCustodyScore } from './scoring'

const SITE_URL = 'https://custodycompare.com'
const SITE_NAME = 'Custody Compare'

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`
}

export function homePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Independent Bitcoin custody comparison with transparent scoring.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/tools/compare?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function providerPageSchema(provider: Provider) {
  const score = calculateCustodyScore(provider.scores)
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'FinancialProduct',
      name: `${provider.name} Bitcoin Custody`,
      provider: {
        '@type': 'Organization',
        name: provider.name,
        url: provider.website,
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: score,
      bestRating: 10,
      worstRating: 1,
    },
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export function comparisonPageSchema(providerA: Provider, providerB: Provider) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${providerA.name} vs ${providerB.name} — Bitcoin Custody Comparison`,
    description: `Head-to-head comparison of ${providerA.name} and ${providerB.name} Bitcoin custody solutions.`,
    breadcrumb: breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Compare', url: '/compare' },
      { name: `${providerA.name} vs ${providerB.name}`, url: `/compare/${providerA.slug}-vs-${providerB.slug}/` },
    ]),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
