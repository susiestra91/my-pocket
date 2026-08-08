import { CURRENCIES } from '../lib/currency'

type Props = {
  currency: string
  country: string | null
  onChange: (currency: string) => void
}

export function CurrencyPicker({ currency, country, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-500">
      <span className="sr-only">Moneda</span>
      <select
        value={currency}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Moneda"
        title={country ? `País detectado: ${country}` : 'País no detectado'}
        className="rounded-lg bg-slate-100 px-2 py-1.5 font-medium text-slate-700 outline-none"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  )
}
