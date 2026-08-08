import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { categoryOf } from '../lib/categories'
import { formatMoney } from '../lib/currency'
import type { Expense } from '../types'

type Props = {
  expenses: Expense[]
  currency: string
  locale: string
}

export function SummaryChart({ expenses, currency, locale }: Props) {
  const totals = new Map<string, number>()
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
  }

  const data = [...totals.entries()]
    .map(([id, total]) => ({ id, label: categoryOf(id).label, color: categoryOf(id).color, total }))
    .sort((a, b) => b.total - a.total)

  if (data.length === 0) return null

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <h2 className="mb-2 text-sm font-semibold text-slate-600">Por categoría</h2>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              formatter={(value) => formatMoney(Number(value), currency, locale)}
            />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
