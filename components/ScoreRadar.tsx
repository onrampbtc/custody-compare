import { CustodyScores } from '@/lib/providers'
import { SCORE_CRITERIA } from '@/lib/scoring'

interface Props {
  scores: CustodyScores
  scoresB?: CustodyScores
  nameA?: string
  nameB?: string
}

const SHORT_LABELS: Record<string, string> = {
  'Security': 'Security',
  'Insurance': 'Insurance',
  'Regulatory': 'Regulatory',
  'Fee Transparency': 'Fees',
  'Track Record': 'Track Record',
  'Withdrawal Flexibility': 'Withdrawals',
  'Reporting & Audit': 'Reporting',
  'Counterparty Diversification': 'Diversification',
}

export default function ScoreRadar({ scores, scoresB, nameA, nameB }: Props) {
  const cx = 150
  const cy = 150
  const r = 100
  const criteria = SCORE_CRITERIA
  const n = criteria.length

  function polarToCart(angle: number, value: number) {
    const a = (angle - 90) * (Math.PI / 180)
    const dist = (value / 10) * r
    return { x: cx + dist * Math.cos(a), y: cy + dist * Math.sin(a) }
  }

  function makePolygon(s: CustodyScores) {
    return criteria
      .map((c, i) => {
        const angle = (360 / n) * i
        const pt = polarToCart(angle, s[c.key])
        return `${pt.x},${pt.y}`
      })
      .join(' ')
  }

  const gridLevels = [2.5, 5, 7.5, 10]

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-5 ring-1 ring-gray-100">
        <svg viewBox="0 0 300 300" className="h-64 w-64 sm:h-72 sm:w-72">
          <defs>
            <radialGradient id="rgA" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#00856F" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00856F" stopOpacity="0.05" />
            </radialGradient>
            <radialGradient id="rgB" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {gridLevels.map((level) => (
            <polygon
              key={level}
              points={criteria.map((_, i) => {
                const pt = polarToCart((360 / n) * i, level)
                return `${pt.x},${pt.y}`
              }).join(' ')}
              fill="none"
              stroke={level === 10 ? '#e2e8f0' : '#f1f5f9'}
              strokeWidth={level === 10 ? 1.5 : 0.75}
              strokeDasharray={level === 10 ? 'none' : '2 3'}
            />
          ))}

          {criteria.map((_, i) => {
            const pt = polarToCart((360 / n) * i, 10)
            return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="#f1f5f9" strokeWidth={0.75} />
          })}

          {scoresB && (
            <>
              <polygon points={makePolygon(scoresB)} fill="url(#rgB)" stroke="#3B82F6" strokeWidth={2} strokeLinejoin="round" />
              {criteria.map((c, i) => {
                const pt = polarToCart((360 / n) * i, scoresB[c.key])
                return <circle key={`b-${c.key}`} cx={pt.x} cy={pt.y} r={3} fill="#3B82F6" stroke="white" strokeWidth={1.5} />
              })}
            </>
          )}

          <polygon points={makePolygon(scores)} fill="url(#rgA)" stroke="#00856F" strokeWidth={2.5} strokeLinejoin="round" />
          {criteria.map((c, i) => {
            const pt = polarToCart((360 / n) * i, scores[c.key])
            return <circle key={`a-${c.key}`} cx={pt.x} cy={pt.y} r={3.5} fill="#00856F" stroke="white" strokeWidth={2} />
          })}

          {criteria.map((c, i) => {
            const angle = (360 / n) * i
            const pt = polarToCart(angle, 12.5)
            return (
              <text key={c.key} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[9px] font-medium">
                {SHORT_LABELS[c.label] || c.label}
              </text>
            )
          })}
        </svg>
      </div>

      {scoresB && nameA && nameB && (
        <div className="mt-4 flex gap-6 text-sm">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-brand shadow-sm" />
            <span className="font-medium text-text-heading">{nameA}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-score-blue shadow-sm" />
            <span className="font-medium text-text-heading">{nameB}</span>
          </span>
        </div>
      )}
    </div>
  )
}
