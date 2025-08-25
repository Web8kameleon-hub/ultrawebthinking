/**
 * UltraBuild Pure Utility Module – për funksione të pastërta, industriale dhe të kontrollueshme.
 */

export function generateHash(input: string): string {
  let hash = 0;
  if (input.length === 0) return hash.toString();

  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return `AGX-${Math.abs(hash)}`;
}