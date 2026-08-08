import { useMemo, useState } from 'react'
import { CurrencyPicker } from './components/CurrencyPicker'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { PeriodTabs } from './components/PeriodTabs'
import { SummaryChart } from './components/SummaryChart'
import { currencySymbol, formatMoney } from './lib/currency'
import { filterByPeriod, periodLabel } from './lib/dates'
import { useCurrency, useExpenses } from './lib/storage'
import type { Period } from './types'

export default function App() {
  const { expenses, addExpense, removeExpense } = useExpenses()
  const { currency, setCurrency, locale, country } = useCurrency()
  const [period, setPeriod] = useState<Period>('day')

  const today = useMemo(() => new Date(), [])
  const visible = useMemo(
    () => filterByPeriod(expenses, period, today),
    [expenses, period, today],
  )
  const total = visible.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            My <span className="text-emerald-600">Pocket</span>
          </h1>
          <CurrencyPicker currency={currency} country={country} onChange={setCurrency} />
        </header>

        <section className="mt-4 rounded-2xl bg-slate-900 p-5 text-white">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {periodLabel(period, today, locale)}
          </p>
          <p className="mt-1 text-3xl font-bold">{formatMoney(total, currency, locale)}</p>
          <p className="mt-1 text-xs text-slate-400">
            {visible.length} {visible.length === 1 ? 'gasto' : 'gastos'}
          </p>
        </section>

        <div className="mt-4">
          <PeriodTabs value={period} onChange={setPeriod} />
        </div>

        <div className="mt-4">
          <ExpenseForm currencySymbol={currencySymbol(currency, locale)} onAdd={addExpense} />
        </div>

        <div className="mt-4">
          <SummaryChart expenses={visible} currency={currency} locale={locale} />
        </div>

        <div className="mt-4">
          <ExpenseList
            expenses={visible}
            currency={currency}
            locale={locale}
            onRemove={removeExpense}
          />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Tus datos se guardan solo en este dispositivo.
        </p>
      </div>
    </div>
  )
}
