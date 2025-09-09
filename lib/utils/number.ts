export function fmt2(value: number): string {
  return value.toFixed(2)
}

export function fmtAddress(addr: string): string {
  if (!addr) return ''
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export function fmtLocale(value: number): string {
  return new Intl.NumberFormat("de-DE").format(value)
}
