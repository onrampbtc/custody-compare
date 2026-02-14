import { getScoreColor, getScoreLabel } from '@/lib/scoring'

interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function CustodyScoreBadge({ score, size = 'md', showLabel = false }: Props) {
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  const sizes = {
    sm: { outer: 'h-9 w-9', text: 'text-xs font-bold', labelText: 'text-xs' },
    md: { outer: 'h-14 w-14', text: 'text-base font-extrabold', labelText: 'text-sm' },
    lg: { outer: 'h-[72px] w-[72px]', text: 'text-2xl font-extrabold', labelText: 'text-base' },
  }

  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${s.outer} flex items-center justify-center rounded-full text-white`}
        style={{
          backgroundColor: color,
          boxShadow: `0 0 0 3px ${color}18, 0 2px 8px ${color}30`,
        }}
        title={`Custody Score: ${score}/10 — ${label}`}
      >
        <span className={s.text}>{score}</span>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={`${s.labelText} font-semibold`} style={{ color }}>
            {label}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Custody Score
          </span>
        </div>
      )}
    </div>
  )
}
