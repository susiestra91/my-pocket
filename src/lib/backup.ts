import type { Expense } from '../types'

export type Backup = {
  app: 'my-pocket'
  version: 1
  exportedAt: string
  currency: string
  expenses: Expense[]
}

function isExpense(value: unknown): value is Expense {
  if (typeof value !== 'object' || value === null) return false
  const e = value as Partial<Expense>
  return (
    typeof e.id === 'string' &&
    typeof e.amount === 'number' &&
    Number.isFinite(e.amount) &&
    typeof e.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(e.date)
  )
}

export function buildBackup(expenses: Expense[], currency: string): Backup {
  return {
    app: 'my-pocket',
    version: 1,
    exportedAt: new Date().toISOString(),
    currency,
    expenses,
  }
}

export function downloadBackup(backup: Backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `my-pocket-${backup.exportedAt.slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export type ParsedBackup = {
  expenses: Expense[]
  currency: string | null
  /** Entradas descartadas por no tener la forma esperada. */
  skipped: number
}

export function parseBackup(text: string): ParsedBackup {
  const data: unknown = JSON.parse(text)
  const raw = Array.isArray(data)
    ? data
    : typeof data === 'object' && data !== null && Array.isArray((data as Backup).expenses)
      ? (data as Backup).expenses
      : null
  if (!raw) throw new Error('El archivo no tiene gastos de My Pocket.')

  const expenses = raw.filter(isExpense).map((e) => ({
    ...e,
    category: typeof e.category === 'string' ? e.category : 'otros',
    note: typeof e.note === 'string' ? e.note : '',
    createdAt: typeof e.createdAt === 'number' ? e.createdAt : Date.now(),
  }))

  const currency =
    !Array.isArray(data) && typeof (data as Backup).currency === 'string'
      ? (data as Backup).currency
      : null

  return { expenses, currency, skipped: raw.length - expenses.length }
}

/** Une por id y deja primero lo mas reciente. */
export function mergeExpenses(current: Expense[], incoming: Expense[]): Expense[] {
  const byId = new Map(current.map((e) => [e.id, e]))
  for (const expense of incoming) byId.set(expense.id, expense)
  return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
}
