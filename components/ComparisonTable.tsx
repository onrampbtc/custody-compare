import { Provider } from '@/lib/providers'
import { SCORE_CRITERIA, calculateCustodyScore, getScoringWeights } from '@/lib/scoring'
import CustodyScoreBadge from './CustodyScoreBadge'

interface Props {
  providerA: Provider
  providerB: Provider
}

export default function ComparisonTable({ providerA, providerB }: Props) {
  const weights = getScoringWeights()
  const scoreA = calculateCustodyScore(providerA.scores)
  const scoreB = calculateCustodyScore(providerB.scores)

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white ring-1 ring-gray-900/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80">
            <th className="py-4 pl-6 pr-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Criterion</th>
            <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Weight</th>
            <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-brand">{providerA.name}</th>
            <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-score-blue">{providerB.name}</th>
            <th className="py-4 pl-4 pr-6 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Winner</th>
          </tr>
        </thead>
        <tbody>
          {SCORE_CRITERIA.map((c) => {
            const key = c.key as keyof typeof weights
            const valA = providerA.scores[key]
            const valB = providerB.scores[key]
            const winner = valA > valB ? 'A' : valB > valA ? 'B' : 'Tie'

            return (
              <tr key={c.key} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                <td className="py-3.5 pl-6 pr-4 font-medium text-text-heading">{c.label}</td>
                <td className="px-4 py-3.5 text-center text-gray-400">{(weights[key] * 100).toFixed(0)}%</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-block rounded-md px-2 py-0.5 font-mono font-semibold ${winner === 'A' ? 'bg-score-green/10 text-score-green' : 'text-text-body'}`}>
                    {valA.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-block rounded-md px-2 py-0.5 font-mono font-semibold ${winner === 'B' ? 'bg-score-green/10 text-score-green' : 'text-text-body'}`}>
                    {valB.toFixed(1)}
                  </span>
                </td>
                <td className="py-3.5 pl-4 pr-6 text-center">
                  {winner === 'Tie' ? (
                    <span className="text-xs font-medium text-gray-300">Tie</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-score-green">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {winner === 'A' ? providerA.name : providerB.name}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50/80">
            <td className="py-5 pl-6 pr-4 text-base font-extrabold text-text-heading">Overall Score</td>
            <td className="px-4 py-5 text-center text-gray-400">100%</td>
            <td className="px-4 py-5"><div className="flex justify-center"><CustodyScoreBadge score={scoreA} size="sm" /></div></td>
            <td className="px-4 py-5"><div className="flex justify-center"><CustodyScoreBadge score={scoreB} size="sm" /></div></td>
            <td className="py-5 pl-4 pr-6 text-center text-sm font-bold text-score-green">
              {scoreA > scoreB ? providerA.name : scoreB > scoreA ? providerB.name : 'Tie'}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
