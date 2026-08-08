import { CURRENCIES, currencyName, currencySymbol } from '../lib/currency'

type Props = {
  currency: string
  locale: string
  country: string | null
  onChange: (currency: string) => void
}

export function CurrencyPicker({ currency, locale, country, onChange }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <label htmlFor="currency" className="block text-sm font-medium text-slate-600">
        Moneda
      </label>
      <select
        id="currency"
        name="currency"
        value={currency}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl bg-slate-100 px-3 py-2.5 font-medium text-slate-900 outline-none"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c} — {currencyName(c, locale)} ({currencySymbol(c, locale)})
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-slate-500">
        {country ? `Detectada según tu país (${country}).` : 'No pudimos detectar tu país.'} Puedes
        cambiarla cuando quieras.
      </p>
    </div>
  )
}
