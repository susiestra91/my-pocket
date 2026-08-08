import type { Expense, Period } from '../types'

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = (d.getDay() + 6) % 7 // lunes = 0
  d.setDate(d.getDate() - day)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function periodRange(period: Period, reference: Date): { from: Date; to: Date } {
  if (period === 'day') {
    const from = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate())
    return { from, to: from }
  }
  if (period === 'week') {
    const from = startOfWeek(reference)
    return { from, to: addDays(from, 6) }
  }
  const from = new Date(reference.getFullYear(), reference.getMonth(), 1)
  const to = new Date(reference.getFullYear(), reference.getMonth() + 1, 0)
  return { from, to }
}

export function isInRange(iso: string, from: Date, to: Date): boolean {
  const d = parseISODate(iso)
  return d >= from && d <= to
}

export function filterByPeriod(expenses: Expense[], period: Period, reference: Date): Expense[] {
  const { from, to } = periodRange(period, reference)
  return expenses.filter((e) => isInRange(e.date, from, to))
}

export function periodLabel(period: Period, reference: Date, locale: string): string {
  const { from, to } = periodRange(period, reference)
  if (period === 'day') {
    return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(from)
  }
  if (period === 'week') {
    const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })
    return `${fmt.format(from)} - ${fmt.format(to)}`
  }
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(from)
}
