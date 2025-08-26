// lib/utils/number.ts
export function fmt2(v: unknown) {
    const n = typeof v === "number" ? v : Number(v ?? 0);
    return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

export function fmtLocale(v: unknown) {
    const n = typeof v === "number" ? v : Number(v ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
}

export function fmtAddress(v: unknown, length: number = 20) {
    const str = typeof v === "string" ? v : String(v ?? "");
    return str.length > length ? `${str.substring(0, length)}...` : str;
}