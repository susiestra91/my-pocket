export const CATEGORIES = [
  { id: 'comida', label: 'Comida', emoji: '🍔', color: '#f97316' },
  { id: 'transporte', label: 'Transporte', emoji: '🚌', color: '#0ea5e9' },
  { id: 'hogar', label: 'Hogar', emoji: '🏠', color: '#22c55e' },
  { id: 'salud', label: 'Salud', emoji: '💊', color: '#ef4444' },
  { id: 'ocio', label: 'Ocio', emoji: '🎬', color: '#a855f7' },
  { id: 'compras', label: 'Compras', emoji: '🛍️', color: '#ec4899' },
  { id: 'otros', label: 'Otros', emoji: '📦', color: '#64748b' },
] as const

export function categoryOf(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]
}
