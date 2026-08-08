import { useRef, useState, type ChangeEvent } from 'react'
import { buildBackup, downloadBackup, mergeExpenses, parseBackup } from '../lib/backup'
import type { Expense } from '../types'

type Props = {
  expenses: Expense[]
  currency: string
  onImport: (expenses: Expense[]) => void
  onCurrency: (currency: string) => void
}

export function BackupPanel({ expenses, currency, onImport, onCurrency }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const parsed = parseBackup(await file.text())
      if (parsed.expenses.length === 0) {
        setMessage({ kind: 'error', text: 'El archivo no contiene gastos válidos.' })
        return
      }
      onImport(mergeExpenses(expenses, parsed.expenses))
      if (parsed.currency) onCurrency(parsed.currency)
      const skipped = parsed.skipped > 0 ? ` (${parsed.skipped} ignorados)` : ''
      setMessage({ kind: 'ok', text: `Se importaron ${parsed.expenses.length} gastos${skipped}.` })
    } catch {
      setMessage({ kind: 'error', text: 'No pudimos leer el archivo. ¿Es un JSON de My Pocket?' })
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <h2 className="text-sm font-semibold text-slate-600">Respaldo</h2>
      <p className="mt-1 text-xs text-slate-500">
        Tus gastos viven solo en este navegador. Exporta un JSON para guardarlos o pasarlos a otro
        dispositivo.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => downloadBackup(buildBackup(expenses, currency))}
          disabled={expenses.length === 0}
          className="rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Exportar JSON
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700"
        >
          Importar JSON
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFile}
        className="hidden"
        aria-label="Importar archivo JSON"
      />
      {message && (
        <p
          role="status"
          className={`mt-2 text-xs ${message.kind === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
