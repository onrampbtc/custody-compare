import providersData from '@/data/providers.json'

export interface Fees {
  setup: string
  custodyAnnual: string
  transaction: string
  withdrawal: string
  notes: string
}

export interface Insurance {
  coverage: string
  carrier: string
  details: string
}

export interface Regulatory {
  licenses: string[]
  qualifiedCustodian: boolean
  jurisdiction: string
  details: string
}

export interface Security {
  keyManagementType: string
  coldStoragePercent: string
  socCompliance: string
  penetrationTesting: boolean
  incidentHistory: string
}

export interface CustodyScores {
  security: number
  insurance: number
  regulatory: number
  feeTransparency: number
  trackRecord: number
  withdrawalFlexibility: number
  reportingAudit: number
  counterpartyDiversification: number
}

export interface Provider {
  id: string
  name: string
  slug: string
  logo: string
  website: string
  founded: number
  headquarters: string
  custodyType: string
  custodyTypeLabel: string
  description: string
  targetAudience: string[]
  aum: string
  minAccount: string
  supportedAssets: string[]
  keyManagement: string
  fees: Fees
  insurance: Insurance
  regulatory: Regulatory
  security: Security
  features: string[]
  scores: CustodyScores
  pros: string[]
  cons: string[]
  competitorComparisons?: Record<string, string>
}

export interface CustodyType {
  id: string
  name: string
  shortDescription: string
  longDescription: string
  bestFor: string[]
  pros: string[]
  cons: string[]
}

export interface ScoringWeights {
  security: number
  insurance: number
  regulatory: number
  feeTransparency: number
  trackRecord: number
  withdrawalFlexibility: number
  reportingAudit: number
  counterpartyDiversification: number
}

const data = providersData as {
  meta: { version: string; lastUpdated: string; scoringVersion: string; totalProviders: number; notes: string }
  scoringWeights: ScoringWeights
  custodyTypes: CustodyType[]
  providers: Provider[]
}

export function getProviders(): Provider[] {
  return data.providers
}

export function getProvider(slug: string): Provider | undefined {
  return data.providers.find((p) => p.slug === slug)
}

export function getCustodyTypes(): CustodyType[] {
  return data.custodyTypes
}

export function getCustodyType(id: string): CustodyType | undefined {
  return data.custodyTypes.find((t) => t.id === id)
}

export function getProvidersByType(typeId: string): Provider[] {
  return data.providers.filter((p) => p.custodyType === typeId)
}

export function getScoringWeights(): ScoringWeights {
  return data.scoringWeights
}

export function getMeta() {
  return data.meta
}
