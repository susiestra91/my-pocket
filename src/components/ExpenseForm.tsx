import { useState, type FormEvent } from 'react'
import { CATEGORIES } from '../lib/categories'
import { toISODate } from '../lib/dates'
import type { Expense } from '../types'

type Props = {
  currencySymbol: string
  onAdd: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
}

export function ExpenseForm({ currencySymbol, onAdd }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0].id)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => toISODate(new Date()))

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const value = Number(amount.replace(',', '.'))
    if (!Number.isFinite(value) || value <= 0) return
    onAdd({ amount: value, category, note: note.trim(), date })
    setAmount('')
    setNote('')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <label className="block text-sm font-medium text-slate-600" htmlFor="amount">
        Monto
      </label>
      <div className="mt-1 flex items-center gap-2 rounded-xl bg-slate-100 px-3">
        <span className="text-lg font-semibold text-slate-500">{currencySymbol}</span>
        <input
          id="amount"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-transparent py-3 text-2xl font-semibold text-slate-900 outline-none"
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {CATEGORIES.map((c) => (
          <button
            type="button"
            key={c.id}
            onClick={() => setCategory(c.id)}
            aria-pressed={category === c.id}
            className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] transition ${
              category === c.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="text-lg">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-600" htmlFor="note">
            Nota
          </label>
          <input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Opcional"
            className="mt-1 w-full rounded-xl bg-slate-100 px-3 py-2.5 text-slate-900 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600" htmlFor="date">
            Fecha
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-100 px-3 py-2.5 text-slate-900 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-base font-semibold text-white active:scale-[0.99]"
      >
        Agregar gasto
      </button>
    </form>
  )
}
