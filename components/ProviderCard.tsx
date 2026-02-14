import Link from 'next/link'
import { Provider } from '@/lib/providers'
import { calculateCustodyScore } from '@/lib/scoring'
import CustodyScoreBadge from './CustodyScoreBadge'

interface Props {
  provider: Provider
  rank?: number
}

export default function ProviderCard({ provider, rank }: Props) {
  const score = calculateCustodyScore(provider.scores)

  return (
    <Link href={`/custodian/${provider.slug}`} className="card group flex items-start gap-4">
      {rank && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-light text-sm font-bold text-text-heading">
          {rank}
        </span>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text-heading group-hover:text-btc-orange">{provider.name}</h3>
            <span className="text-xs text-gray-500">{provider.custodyTypeLabel}</span>
          </div>
          <CustodyScoreBadge score={score} size="sm" />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-text-body line-clamp-2">{provider.description}</p>
      </div>
    </Link>
  )
}
