import { useCallback, useEffect, useState } from 'react'
import type { Expense } from '../types'
import { detectLocale } from './currency'

const EXPENSES_KEY = 'my-pocket:expenses'
const CURRENCY_KEY = 'my-pocket:currency'

function readExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is Expense => {
      if (typeof item !== 'object' || item === null) return false
      const e = item as Partial<Expense>
      return typeof e.id === 'string' && typeof e.amount === 'number' && typeof e.date === 'string'
    })
  } catch {
    return []
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(readExpenses)

  useEffect(() => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
  }, [expenses])

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setExpenses((prev) => [
      { ...expense, id: crypto.randomUUID(), createdAt: Date.now() },
      ...prev,
    ])
  }, [])

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const replaceAll = useCallback((next: Expense[]) => setExpenses(next), [])

  return { expenses, addExpense, removeExpense, replaceAll }
}

export function useCurrency() {
  const detected = detectLocale()
  const [currency, setCurrency] = useState<string>(
    () => localStorage.getItem(CURRENCY_KEY) ?? detected.currency,
  )

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency)
  }, [currency])

  return { currency, setCurrency, locale: detected.locale, country: detected.country }
}
