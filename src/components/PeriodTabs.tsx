import type { Period } from '../types'

const OPTIONS: { id: Period; label: string }[] = [
  { id: 'day', label: 'Día' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mes' },
]

type Props = {
  value: Period
  onChange: (period: Period) => void
}

export function PeriodTabs({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-200/70 p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={`rounded-lg py-2 text-sm font-medium transition ${
            value === option.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
