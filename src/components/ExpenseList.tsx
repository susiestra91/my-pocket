import { categoryOf } from '../lib/categories'
import { formatMoney } from '../lib/currency'
import { parseISODate } from '../lib/dates'
import type { Expense } from '../types'

type Props = {
  expenses: Expense[]
  currency: string
  locale: string
  onRemove: (id: string) => void
}

export function ExpenseList({ expenses, currency, locale, onRemove }: Props) {
  if (expenses.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">
        Sin gastos en este periodo.
      </p>
    )
  }

  const dateFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      {expenses.map((expense) => {
        const category = categoryOf(expense.category)
        return (
          <li key={expense.id} className="flex items-center gap-3 px-4 py-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
              style={{ backgroundColor: `${category.color}22` }}
            >
              {category.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-900">{expense.note || category.label}</p>
              <p className="text-xs text-slate-500">{dateFmt.format(parseISODate(expense.date))}</p>
            </div>
            <span className="font-semibold text-slate-900">
              {formatMoney(expense.amount, currency, locale)}
            </span>
            <button
              type="button"
              onClick={() => onRemove(expense.id)}
              aria-label={`Eliminar ${expense.note || category.label}`}
              className="rounded-full px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
            >
              ✕
            </button>
          </li>
        )
      })}
    </ul>
  )
}
