export function fmt(n?: number | string, suffix = '') {
  if (n === undefined || n === null || Number.isNaN(Number(n))) return '—';
  const num = Number(n);
  if (num >= 1_000_000) return (num/1_000_000).toFixed(1) + 'M' + suffix;
  if (num >= 1_000) return (num/1_000).toFixed(1) + 'k' + suffix;
  return num + suffix;
}

export const safe = (v: any, fallback: any) => (v ?? fallback);
