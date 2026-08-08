/**
 * Deteccion de pais y moneda 100% local: usa la zona horaria e idioma del
 * navegador, sin ninguna llamada de red.
 */

const COUNTRY_CURRENCY: Record<string, string> = {
  AR: 'ARS', AU: 'AUD', BO: 'BOB', BR: 'BRL', CA: 'CAD', CH: 'CHF', CL: 'CLP',
  CN: 'CNY', CO: 'COP', CR: 'CRC', CU: 'CUP', CZ: 'CZK', DK: 'DKK', DO: 'DOP',
  EC: 'USD', GB: 'GBP', GT: 'GTQ', HN: 'HNL', HK: 'HKD', HU: 'HUF', ID: 'IDR',
  IL: 'ILS', IN: 'INR', JP: 'JPY', KR: 'KRW', MA: 'MAD', MX: 'MXN', MY: 'MYR',
  NG: 'NGN', NI: 'NIO', NO: 'NOK', NZ: 'NZD', PA: 'PAB', PE: 'PEN', PH: 'PHP',
  PL: 'PLN', PY: 'PYG', RO: 'RON', RU: 'RUB', SE: 'SEK', SG: 'SGD', SV: 'USD',
  TH: 'THB', TR: 'TRY', TW: 'TWD', UA: 'UAH', US: 'USD', UY: 'UYU', VE: 'VES',
  VN: 'VND', ZA: 'ZAR',
  AD: 'EUR', AT: 'EUR', BE: 'EUR', CY: 'EUR', DE: 'EUR', EE: 'EUR', ES: 'EUR',
  FI: 'EUR', FR: 'EUR', GR: 'EUR', IE: 'EUR', IT: 'EUR', LT: 'EUR', LU: 'EUR',
  LV: 'EUR', MT: 'EUR', NL: 'EUR', PT: 'EUR', SI: 'EUR', SK: 'EUR',
}

const TIMEZONE_COUNTRY: Record<string, string> = {
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Bogota': 'CO',
  'America/Caracas': 'VE',
  'America/Costa_Rica': 'CR',
  'America/El_Salvador': 'SV',
  'America/Guatemala': 'GT',
  'America/Guayaquil': 'EC',
  'America/Havana': 'CU',
  'America/La_Paz': 'BO',
  'America/Lima': 'PE',
  'America/Managua': 'NI',
  'America/Mexico_City': 'MX',
  'America/Montevideo': 'UY',
  'America/Panama': 'PA',
  'America/Santiago': 'CL',
  'America/Santo_Domingo': 'DO',
  'America/Sao_Paulo': 'BR',
  'America/Tegucigalpa': 'HN',
  'America/Asuncion': 'PY',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'Europe/Madrid': 'ES',
  'Europe/Lisbon': 'PT',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Rome': 'IT',
  'Europe/London': 'GB',
  'Europe/Amsterdam': 'NL',
  'Europe/Dublin': 'IE',
  'Europe/Zurich': 'CH',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Warsaw': 'PL',
  'Europe/Moscow': 'RU',
}

export type DetectedLocale = {
  country: string | null
  currency: string
  locale: string
}

function countryFromLanguage(language: string): string | null {
  const region = language.split(/[-_]/)[1]
  return region && region.length === 2 ? region.toUpperCase() : null
}

function countryFromTimeZone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!tz) return null
    if (TIMEZONE_COUNTRY[tz]) return TIMEZONE_COUNTRY[tz]
    return null
  } catch {
    return null
  }
}

/** La interfaz es en espanol, asi que el formato tambien: solo la region varia. */
export function detectLocale(): DetectedLocale {
  const language = (typeof navigator !== 'undefined' && navigator.language) || 'en-US'
  const country = countryFromTimeZone() ?? countryFromLanguage(language)
  const currency = (country && COUNTRY_CURRENCY[country]) || 'USD'
  return { country, currency, locale: country ? `es-${country}` : 'es' }
}

export function currencyName(currency: string, locale: string): string {
  try {
    const name = new Intl.DisplayNames([locale], { type: 'currency' }).of(currency)
    return name ?? currency
  } catch {
    return currency
  }
}

export const CURRENCIES: string[] = Array.from(new Set(Object.values(COUNTRY_CURRENCY))).sort()

export function formatMoney(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function currencySymbol(currency: string, locale: string): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0)
    return parts.find((p) => p.type === 'currency')?.value ?? currency
  } catch {
    return currency
  }
}
