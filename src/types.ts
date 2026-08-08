export type Expense = {
  id: string
  amount: number
  category: string
  note: string
  /** Fecha local en formato YYYY-MM-DD */
  date: string
  createdAt: number
}

export type Period = 'day' | 'week' | 'month'
