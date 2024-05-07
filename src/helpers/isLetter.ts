export default function isLetter(x: string): boolean {
  return x.length === 1 && /^[a-zA-Z]$/.test(x);
}